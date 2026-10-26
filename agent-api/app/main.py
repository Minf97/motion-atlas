import json
import os
import asyncio
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from .config import get_settings
from .model import ModelRouter
from .knowledge import VectorStore, load_chunks
from .schemas import ChatRequest
from .workflow import AgentWorkflow
from .tools import AgentTools
from .evaluation import run_cases
from .workspace import workspace_snapshot
from .bilibili import router as bilibili_router
from .bilibili_store import BilibiliStore
from .bilibili_worker import BilibiliCollector
from redis.asyncio import Redis

settings = get_settings()
knowledge_dir = Path(__file__).resolve().parent.parent / "knowledge"
workflow = AgentWorkflow(knowledge_dir, ModelRouter(settings), AgentTools(VectorStore(load_chunks(knowledge_dir)), settings))
@asynccontextmanager
async def lifespan(application: FastAPI):
    redis_url = os.getenv("REDIS_URL", "")
    application.state.bilibili_store = None
    if redis_url:
        redis = Redis.from_url(redis_url, decode_responses=True)
        store = BilibiliStore(redis, int(os.getenv("BILIBILI_MAX_AGE_SECONDS", "1800")))
        collector = BilibiliCollector(
            store,
            float(os.getenv("BILIBILI_SAMPLE_INTERVAL_SECONDS", "4")),
            float(os.getenv("BILIBILI_DISCOVERY_INTERVAL_SECONDS", "900")),
            float(os.getenv("BILIBILI_COOLDOWN_SECONDS", "1800")),
        )
        application.state.bilibili_store = store
        application.state.bilibili_collector = collector
        task = asyncio.create_task(collector.run())
        try:
            yield
        finally:
            task.cancel()
            await asyncio.gather(task, return_exceptions=True)
            await collector.close()
            await redis.aclose()
    else:
        yield


app = FastAPI(title="Minf Personal Agent API", version="1.0.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=settings.allowed_origins, allow_methods=["GET", "POST"], allow_headers=["content-type"])
app.include_router(bilibili_router)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/workspace")
async def workspace() -> dict:
    return workspace_snapshot(workflow, settings)


@app.post("/chat")
async def chat(request: ChatRequest) -> StreamingResponse:
    async def events():
        active_stage = "input"
        try:
            async for event in workflow.stream(request.question, request.model, [message.model_dump() for message in request.history]):
                if event.get("type") == "stage" and event.get("status") == "running":
                    active_stage = event["stage"]
                yield f"data: {json.dumps(event, ensure_ascii=False)}\n\n"
        except Exception as error:
            yield f"data: {json.dumps({'type': 'error', 'stage': active_stage, 'status': 'error', 'content': str(error)}, ensure_ascii=False)}\n\n"

    return StreamingResponse(events(), media_type="text/event-stream", headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})


@app.post("/evaluate")
async def evaluate(model: str = Query(default="openai", pattern="^(openai|deepseek)$")) -> StreamingResponse:

    async def events():
        try:
            async for result in run_cases(workflow, model):
                yield f"data: {json.dumps(result, ensure_ascii=False)}\n\n"
        except Exception as error:
            yield f"data: {json.dumps({'error': str(error)}, ensure_ascii=False)}\n\n"

    return StreamingResponse(events(), media_type="text/event-stream", headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})
