# Minf Personal Agent API

```bash
cd agent-api
uv venv --python 3.12 .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

Set model keys, compatible base URLs and `TAVILY_API_KEY` in `.env`. The API exposes `GET /health`, streaming `POST /chat`, and streaming `POST /evaluate?model=openai`.

The Bilibili collector requires Railway Redis (`REDIS_URL`). Add a Redis service in the Railway project and make its connection URL available to `agent-api` as `REDIS_URL`. It discovers up to 100 candidates in each configured category and samples one video at a time. Defaults are a 4-second minimum interval between every upstream HTTP request, 15-minute candidate refresh, 30-minute risk-control cooldown, and 30-minute observation freshness window. Risk-control responses (`-352`, `-412`, `-429`, HTTP 403/412/429) pause collection; successful observations remain in Redis and stale observations are excluded from the public ranking. Page refreshes only read Redis.

Reviewed Markdown documents in `knowledge/` are indexed with local TF-IDF vectors. Replace `VectorStore` with pgvector when the corpus grows.

```bash
pytest
```

The Agent page runs two fixed evaluation cases: personal knowledge and web search. Checks inspect actual tool calls, evidence and numbered citations. Credentials stay server-side. The OpenAI-compatible relay must support chat function calling.
