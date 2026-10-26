import json
from datetime import datetime, timedelta, timezone

import asyncio

from app.bilibili_store import BilibiliStore


class Pipeline:
    def __init__(self, redis):
        self.redis = redis
        self.commands = []

    def set(self, key, value):
        self.commands.append(("set", key, value))

    def sadd(self, key, value):
        self.commands.append(("sadd", key, value))

    def zadd(self, key, mapping):
        self.commands.append(("zadd", key, mapping))

    def zrem(self, key, value):
        self.commands.append(("zrem", key, value))

    def delete(self, key):
        self.commands.append(("delete", key, None))

    async def execute(self):
        for command, key, value in self.commands:
            if command == "set":
                await self.redis.set(key, value)
            elif command == "sadd":
                self.redis.sets.setdefault(key, set()).add(value)
            elif command == "delete":
                self.redis.values.pop(key, None)
                self.redis.sets.pop(key, None)
            elif command == "zrem":
                self.redis.sorted.setdefault(key, {}).pop(value, None)
            else:
                self.redis.sorted.setdefault(key, {}).update(value)


class MemoryRedis:
    def __init__(self):
        self.values = {}
        self.sets = {}
        self.sorted = {}
        self.hashes = {}

    def pipeline(self):
        return Pipeline(self)

    async def get(self, key):
        return self.values.get(key)

    async def set(self, key, value):
        self.values[key] = value

    async def mget(self, keys):
        return [self.values.get(key) for key in keys]

    async def smembers(self, key):
        return self.sets.get(key, set())

    async def hgetall(self, key):
        return self.hashes.get(key, {})

    async def hset(self, key, mapping):
        self.hashes[key] = mapping


def test_store_keeps_last_success_and_marks_stale_observations():
    async def run():
        redis = MemoryRedis()
        store = BilibiliStore(redis, max_age_seconds=30)
        await store.add_candidates("technology", [{"aid": "1", "category": "technology", "title": "A"}])
        await store.save_observation("1", 123, datetime.now(timezone.utc).isoformat())
        await store.mark_error("1", "risk controlled")
        record = json.loads(await redis.get("bilibili:video:1"))
        assert record["online"] == 123
        assert record["sample_error"] == "risk controlled"

        old = datetime.now(timezone.utc) - timedelta(minutes=2)
        await store.save_observation("1", 123, old.isoformat())
        result = await store.get_ranking("technology")
        assert result["candidate_count"] == 1
        assert result["fresh_count"] == 0
        assert result["stale_count"] == 1
        assert result["videos"][0]["aid"] == "1"
        assert result["videos"][0]["stale"] is True
        assert result["videos"][0]["age_seconds"] >= 30
    asyncio.run(run())


def test_store_returns_fresh_videos_in_online_order():
    async def run():
        store = BilibiliStore(MemoryRedis())
        await store.add_candidates("life", [
            {"aid": "a", "category": "life", "title": "A"},
            {"aid": "b", "category": "life", "title": "B"},
        ])
        now = datetime.now(timezone.utc).isoformat()
        await store.save_observation("a", 12, now)
        await store.save_observation("b", 35, now)
        result = await store.get_ranking("life")
        assert [video["aid"] for video in result["videos"]] == ["b", "a"]
        assert [video["rank"] for video in result["videos"]] == [1, 2]
    asyncio.run(run())


def test_discovery_replaces_departed_candidates():
    async def run():
        redis = MemoryRedis()
        store = BilibiliStore(redis)
        await store.add_candidates("technology", [{"aid": "old", "category": "technology"}])
        await store.add_candidates("technology", [{"aid": "new", "category": "technology"}])
        assert [video["aid"] for video in await store.get_candidates("technology")] == ["new"]
        assert await redis.get("bilibili:video:old") is None
    asyncio.run(run())
