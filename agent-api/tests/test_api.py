import json

from fastapi.testclient import TestClient

from app.main import app, workflow


def test_chat_stream_exposes_real_events(monkeypatch):
    async def fake_stream(question, provider, history):
        yield {"type": "plan", "content": "web_search"}
        yield {"type": "tool", "content": "web_search", "query": question}
        yield {"type": "evidence", "content": "1 source", "sources": [{"title": "Official", "url": "https://python.org", "kind": "web", "excerpt": "Result"}]}
        yield {"type": "answer", "content": "Version from source [1]"}

    monkeypatch.setattr(workflow, "stream", fake_stream)
    response = TestClient(app).post("/chat", json={"question": "Python version?", "model": "deepseek"})
    events = [json.loads(line[6:]) for line in response.text.splitlines() if line.startswith("data: ")]
    assert response.status_code == 200
    assert [event["type"] for event in events] == ["plan", "tool", "evidence", "answer"]
    assert events[1]["query"] == "Python version?"


def test_evaluation_rejects_unknown_provider():
    response = TestClient(app).post("/evaluate?model=unknown")
    assert response.status_code == 422


def test_bilibili_ranking_rejects_unknown_category():
    response = TestClient(app).get("/bilibili/ranking?category=music")
    assert response.status_code == 422


def test_ranking_reports_missing_redis_cache(monkeypatch):
    monkeypatch.delenv("REDIS_URL", raising=False)
    with TestClient(app) as client:
        response = client.get("/bilibili/ranking?category=life")
    assert response.status_code == 503
    assert response.json()["detail"] == "Bilibili cache is not configured"


def test_ranking_reads_only_from_configured_store(monkeypatch):
    class Store:
        async def get_ranking(self, category):
            return {"category": category, "videos": [], "candidate_count": 0}

    monkeypatch.delenv("REDIS_URL", raising=False)
    with TestClient(app) as client:
        app.state.bilibili_store = Store()
        response = client.get("/bilibili/ranking?category=technology")
    assert response.status_code == 200
    assert response.json()["category"] == "technology"
