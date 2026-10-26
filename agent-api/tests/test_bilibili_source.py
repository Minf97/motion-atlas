import asyncio

from app import bilibili
from app.bilibili_worker import BilibiliCollector


def test_discovery_limits_candidates_and_normalizes_fields(monkeypatch):
    async def fake_fetch_json(client, path, **params):
        assert path.endswith("ranking/v2")
        assert params["rid"] == bilibili.AREAS["technology"]
        return {"list": [
            {"aid": index, "bvid": f"BV{index}", "cid": index, "title": f"Video {index}",
             "pic": "http://i0.hdslb.com/cover.jpg", "owner": {"name": "Minf"}, "tname": "科技"}
            for index in range(120)
        ]}

    monkeypatch.setattr(bilibili, "fetch_json", fake_fetch_json)
    videos = asyncio.run(bilibili.discover_candidates(None, "technology"))
    assert len(videos) == 100
    assert videos[0]["cover"] == "https://i0.hdslb.com/cover.jpg"
    assert videos[-1]["aid"] == "99"


def test_transient_upstream_codes_are_classified_for_cooldown():
    assert bilibili.TRANSIENT_CODES == {-352, -412, -429}
    assert bilibili.TRANSIENT_HTTP_STATUSES == {403, 412, 429}


def test_sampling_cursor_advances_independently_for_each_category():
    collector = BilibiliCollector.__new__(BilibiliCollector)
    collector._candidate_indexes = {}
    technology = [{"aid": str(index)} for index in range(4)]
    life = [{"aid": f"l{index}"} for index in range(4)]
    assert [collector._next_candidate("technology", technology)["aid"] for _ in range(2)] == ["0", "1"]
    assert [collector._next_candidate("life", life)["aid"] for _ in range(2)] == ["l0", "l1"]
