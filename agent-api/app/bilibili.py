import re
from typing import Literal

import httpx
from fastapi import APIRouter, HTTPException, Query, Request, Response
from urllib.parse import urlparse

router = APIRouter()
BILIBILI_API = "https://api.bilibili.com"
AREAS = {"technology": 188, "life": 160}
TRANSIENT_CODES = {-352, -412, -429}
TRANSIENT_HTTP_STATUSES = {403, 412, 429}


class BilibiliRiskControlError(RuntimeError):
    # 标记上游风控
    pass


def parse_online_count(value: str) -> int:
    # 解析在线人数
    match = re.search(r"([\d,.]+)\s*(亿|万)?", value)
    if not match:
        raise ValueError(f"Invalid Bilibili online count: {value}")
    count = float(match.group(1).replace(",", ""))
    return round(count * {"亿": 100_000_000, "万": 10_000, None: 1}[match.group(2)])


def is_allowed_cover_url(value: str) -> bool:
    parsed = urlparse(value)
    host = parsed.hostname or ""
    return parsed.scheme == "https" and (host == "hdslb.com" or host.endswith(".hdslb.com"))


async def fetch_json(client: httpx.AsyncClient, path: str, **params: str | int) -> dict:
    # 读取上游接口
    response = await client.get(
        BILIBILI_API + path,
        params=params,
        headers={
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/131 Safari/537.36",
            "Referer": "https://www.bilibili.com/",
            "Origin": "https://www.bilibili.com",
            "Accept": "application/json, text/plain, */*",
        },
    )
    try:
        response.raise_for_status()
    except httpx.HTTPStatusError as error:
        if error.response.status_code in TRANSIENT_HTTP_STATUSES:
            raise BilibiliRiskControlError(f"Bilibili HTTP status {error.response.status_code}") from error
        raise
    payload = response.json()
    code = payload.get("code")
    if code == 0:
        return payload["data"]
    error = f"Bilibili API {path} returned {code}: {payload.get('message')}"
    if code in TRANSIENT_CODES:
        raise BilibiliRiskControlError(error)
    raise RuntimeError(error)


async def discover_candidates(client: httpx.AsyncClient, category: Literal["technology", "life"]) -> list[dict]:
    data = await fetch_json(client, "/x/web-interface/ranking/v2", rid=AREAS[category], type="all")
    return [
        {
            "aid": str(item["aid"]), "bvid": item["bvid"], "cid": item.get("cid"),
            "title": item["title"], "url": f"https://www.bilibili.com/video/{item['bvid']}/",
            "cover": item["pic"].replace("http://", "https://"), "author": item["owner"]["name"],
            "area": item["tname"], "category": category,
        }
        for item in data["list"][:100]
    ]


async def sample_online(client: httpx.AsyncClient, video: dict) -> int:
    cid = video.get("cid")
    if not cid:
        details = await fetch_json(client, "/x/web-interface/view", aid=video["aid"])
        cid = details.get("cid") or details["pages"][0]["cid"]
        video["cid"] = cid
    online = await fetch_json(client, "/x/player/online/total", aid=int(video["aid"]), cid=cid)
    return parse_online_count(online["total"])


@router.get("/bilibili/ranking")
async def bilibili_ranking(request: Request, category: Literal["technology", "life"] = Query(default="technology")) -> dict:
    store = getattr(request.app.state, "bilibili_store", None)
    if store is None:
        raise HTTPException(status_code=503, detail="Bilibili cache is not configured")
    return await store.get_ranking(category)


@router.get("/bilibili/cover")
async def bilibili_cover(url: str = Query(min_length=1, max_length=2048)) -> Response:
    if not is_allowed_cover_url(url):
        raise HTTPException(status_code=400, detail="Cover host is not allowed")
    async with httpx.AsyncClient(timeout=15) as client:
        try:
            image = await client.get(url, headers={"Referer": "https://www.bilibili.com/", "User-Agent": "Mozilla/5.0"})
            image.raise_for_status()
        except httpx.HTTPError as error:
            raise HTTPException(status_code=502, detail=f"Bilibili cover request failed: {error}") from error
    return Response(image.content, media_type=image.headers["content-type"], headers={"Cache-Control": "public, max-age=86400"})
