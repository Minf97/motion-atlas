import asyncio
from datetime import datetime, timezone

import httpx

from .bilibili import BilibiliRiskControlError, discover_candidates, sample_online
from .bilibili_store import BilibiliStore


class PacedHttpClient:
    def __init__(self, client: httpx.AsyncClient, interval: float):
        self.client = client
        self.interval = interval
        self.last_request_at = 0.0

    async def get(self, *args, **kwargs):
        # 限制请求频率
        loop = asyncio.get_running_loop()
        delay = self.interval - (loop.time() - self.last_request_at)
        if delay > 0:
            await asyncio.sleep(delay)
        response = await self.client.get(*args, **kwargs)
        self.last_request_at = loop.time()
        return response


class BilibiliCollector:
    def __init__(self, store: BilibiliStore, sample_interval: float = 4, discovery_interval: float = 900, cooldown_seconds: float = 1800):
        self.store = store
        self.sample_interval = sample_interval
        self.discovery_interval = discovery_interval
        self.cooldown_seconds = cooldown_seconds
        self._last_discovery: dict[str, float] = {}
        self._cooldown_until = 0.0
        self._category_index = 0
        self._candidate_indexes: dict[str, int] = {}
        self._http = httpx.AsyncClient(timeout=15)
        self._paced_http = PacedHttpClient(self._http, sample_interval)

    async def close(self) -> None:
        await self._http.aclose()

    async def run(self) -> None:
        # 按单队列轮询
        categories = ("technology", "life")
        while True:
            if asyncio.get_running_loop().time() < self._cooldown_until:
                await self._write_status("cooldown", "risk control", self._cooldown_until)
                await asyncio.sleep(min(self.sample_interval, self._cooldown_until - asyncio.get_running_loop().time()))
                continue
            category = categories[self._category_index % len(categories)]
            self._category_index += 1
            candidate = None
            try:
                await self._discover_if_due(category)
                candidates = await self.store.get_candidates(category)
                if candidates:
                    candidate = self._next_candidate(category, candidates)
                    online = await sample_online(self._paced_http, candidate)
                    await self.store.save_observation(candidate["aid"], online, cid=candidate.get("cid"))
                await self._write_status("running", None)
            except BilibiliRiskControlError as error:
                if candidate:
                    await self.store.mark_error(candidate["aid"], str(error))
                self._cooldown_until = asyncio.get_running_loop().time() + self.cooldown_seconds
                await self._write_status("cooldown", str(error), self._cooldown_until)
            await asyncio.sleep(self.sample_interval)

    def _next_candidate(self, category: str, candidates: list[dict]) -> dict:
        index = self._candidate_indexes.get(category, 0)
        self._candidate_indexes[category] = index + 1
        return candidates[index % len(candidates)]

    async def _discover_if_due(self, category: str) -> None:
        loop = asyncio.get_running_loop()
        if loop.time() - self._last_discovery.get(category, -self.discovery_interval) < self.discovery_interval:
            return
        candidates = await discover_candidates(self._paced_http, category)
        await self.store.add_candidates(category, candidates)
        self._last_discovery[category] = loop.time()

    async def _write_status(self, state: str, error: str | None, cooldown_until: float | None = None) -> None:
        remaining = max(0, cooldown_until - asyncio.get_running_loop().time()) if cooldown_until else 0
        cooldown_at = datetime.now(timezone.utc).timestamp() + remaining if remaining else 0
        status = {
            "state": state,
            "error": error or "",
            "updated_at": datetime.now(timezone.utc).isoformat(),
            "cooldown_until": datetime.fromtimestamp(cooldown_at, timezone.utc).isoformat() if cooldown_at else "",
        }
        await self.store.redis.hset("bilibili:collector:status", mapping=status)
