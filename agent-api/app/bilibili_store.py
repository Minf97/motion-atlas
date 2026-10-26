import json
from datetime import datetime, timezone
from typing import Literal

from redis.asyncio import Redis


class BilibiliStore:
    def __init__(self, redis: Redis, max_age_seconds: int = 1800):
        self.redis = redis
        self.max_age_seconds = max_age_seconds

    async def add_candidates(self, category: str, videos: list[dict]) -> None:
        # 替换分区候选
        now = datetime.now(timezone.utc).isoformat()
        candidate_key = self._candidate_key(category)
        previous_ids = await self.redis.smembers(candidate_key)
        current_ids = {video["aid"] for video in videos}
        pipe = self.redis.pipeline()
        pipe.delete(candidate_key)
        for video in videos:
            key = self._video_key(video["aid"])
            old = await self.redis.get(key)
            record = json.loads(old) if old else {}
            record.update(video)
            record["discovered_at"] = now
            pipe.set(key, json.dumps(record, ensure_ascii=False))
            pipe.sadd(candidate_key, video["aid"])
        for aid in previous_ids - current_ids:
            pipe.delete(self._video_key(aid))
            pipe.zrem(self._ranking_key(category), aid)
        await pipe.execute()

    async def save_observation(self, aid: str, online: int, updated_at: str | None = None, cid: int | None = None) -> None:
        # 只更新成功观测
        key = self._video_key(aid)
        raw = await self.redis.get(key)
        if raw is None:
            raise KeyError(f"Unknown Bilibili candidate: {aid}")
        record = json.loads(raw)
        record.update({"online": online, "online_updated_at": updated_at or datetime.now(timezone.utc).isoformat(), "sample_error": None})
        if cid:
            record["cid"] = cid
        pipe = self.redis.pipeline()
        pipe.set(key, json.dumps(record, ensure_ascii=False))
        pipe.zadd(self._ranking_key(record["category"]), {aid: online})
        await pipe.execute()

    async def mark_error(self, aid: str, error: str) -> None:
        # 保留旧观测值
        key = self._video_key(aid)
        raw = await self.redis.get(key)
        if raw is None:
            raise KeyError(f"Unknown Bilibili candidate: {aid}")
        record = json.loads(raw)
        record["sample_error"] = error
        record["last_attempt_at"] = datetime.now(timezone.utc).isoformat()
        await self.redis.set(key, json.dumps(record, ensure_ascii=False))

    async def get_candidates(self, category: str) -> list[dict]:
        ids = await self.redis.smembers(self._candidate_key(category))
        records = await self.redis.mget([self._video_key(aid) for aid in ids])
        return [json.loads(item) for item in records if item]

    async def get_ranking(self, category: Literal["technology", "life"]) -> dict:
        # 保留历史观测
        records = await self.get_candidates(category)
        now = datetime.now(timezone.utc)
        observed = []
        for item in records:
            updated_at = item.get("online_updated_at")
            age_seconds = None
            if updated_at:
                age_seconds = max(0, round((now - datetime.fromisoformat(updated_at)).total_seconds()))
            if "online" in item:
                observed.append({**item, "age_seconds": age_seconds,
                                 "stale": age_seconds is not None and age_seconds > self.max_age_seconds})
        observed.sort(key=lambda item: item["online"], reverse=True)
        status = await self.redis.hgetall("bilibili:collector:status")
        sampled_at = max((item["online_updated_at"] for item in observed if item.get("online_updated_at")), default=None)
        return {
            "category": category,
            "sampled_at": sampled_at,
            "candidate_count": len(records),
            "fresh_count": sum(1 for item in observed if not item["stale"]),
            "stale_count": sum(1 for item in observed if item["stale"]),
            "collector": status,
            "videos": [{**item, "rank": index + 1} for index, item in enumerate(observed)],
        }

    @staticmethod
    def _video_key(aid: str) -> str:
        return f"bilibili:video:{aid}"

    @staticmethod
    def _candidate_key(category: str) -> str:
        return f"bilibili:candidates:{category}"

    @staticmethod
    def _ranking_key(category: str) -> str:
        return f"bilibili:ranking:{category}"
