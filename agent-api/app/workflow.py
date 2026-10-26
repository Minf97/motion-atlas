import json
import time
from pathlib import Path
from typing import AsyncIterator, TypedDict
from uuid import uuid4

from langgraph.graph import END, START, StateGraph
from langgraph.types import StreamWriter

from .knowledge import VectorStore, load_chunks
from .model import ModelRouter
from .tools import AgentTools

MAX_STEPS = 4


class AgentState(TypedDict, total=False):
    provider: str
    messages: list[dict]
    calls: list[dict]
    sources: list[dict]
    steps: int
    answer: str


# 标记真实阶段
def stage(name: str, status: str, content: str, cycle: int = 0) -> dict:
    return {"type": "stage", "stage": name, "status": status, "content": content, "cycle": cycle}


class AgentWorkflow:
    def __init__(self, knowledge_dir: Path, router: ModelRouter, tools: AgentTools) -> None:
        self.store = VectorStore(load_chunks(knowledge_dir))
        self.router = router
        self.tools = tools
        graph = StateGraph(AgentState)
        graph.add_node("decide", self.decide)
        graph.add_node("execute", self.execute)
        graph.add_edge(START, "decide")
        graph.add_conditional_edges("decide", self.route, {"execute": "execute", "end": END})
        graph.add_edge("execute", "decide")
        self.graph = graph.compile()

    # 按观察作决策
    async def decide(self, state: AgentState, writer: StreamWriter) -> AgentState:
        cycle = state["steps"] + 1
        writer(stage("model", "running", "Calling model", cycle))
        reply = await self.router.respond(state["provider"], state["messages"], state["steps"] < MAX_STEPS)
        calls = reply.get("tool_calls", [])
        if calls and state["steps"] >= MAX_STEPS:
            raise RuntimeError("Agent exceeded the tool step limit")
        if not calls and not reply.get("content"):
            raise RuntimeError("Agent returned no answer")
        writer(stage("model", "completed", "Model returned a decision", cycle))
        if calls:
            names = ", ".join(call["function"]["name"] for call in calls)
            writer({"type": "plan", "stage": "model", "content": names, "cycle": cycle})
        return {"calls": calls, "answer": reply.get("content") or "", "messages": [*state["messages"], reply]}

    def route(self, state: AgentState) -> str:
        return "execute" if state["calls"] else "end"

    # 执行模型选定工具
    async def execute(self, state: AgentState, writer: StreamWriter) -> AgentState:
        cycle = state["steps"] + 1
        messages = list(state["messages"])
        sources = list(state["sources"])
        new_sources = []
        writer(stage("tools", "running", "Executing selected tools", cycle))
        for call in state["calls"]:
            name = call["function"]["name"]
            query = json.loads(call["function"]["arguments"])["query"]
            start = time.perf_counter()
            writer({"type": "tool", "stage": "tools", "status": "running", "content": name, "query": query, "call_id": call["id"], "cycle": cycle})
            results = await self.tools.run(name, query)
            numbered = [{"id": len(sources) + index + 1, **source} for index, source in enumerate(results)]
            sources.extend(numbered)
            new_sources.extend(numbered)
            writer({"type": "tool", "stage": "tools", "status": "completed", "content": name, "query": query, "call_id": call["id"], "cycle": cycle,
                    "duration_ms": round((time.perf_counter() - start) * 1000), "sources": numbered})
            messages.append({"role": "tool", "tool_call_id": call["id"], "content": json.dumps(numbered, ensure_ascii=False)})
        writer(stage("tools", "completed", "Tool results returned", cycle))
        writer(stage("observe", "running", "Adding evidence to model context", cycle))
        writer({"type": "evidence", "stage": "observe", "content": f"{len(new_sources)} sources", "sources": new_sources, "cycle": cycle})
        writer(stage("observe", "completed", "Evidence ready for the next decision", cycle))
        return {"messages": messages, "sources": sources, "steps": state["steps"] + 1}

    # 输出真实执行轨迹
    async def stream(self, question: str, provider: str, history: list[dict] | None = None) -> AsyncIterator[dict]:
        run_id = uuid4().hex
        start = time.perf_counter()
        sequence = 0
        initial: AgentState = {"provider": provider, "messages": [*(history or []), {"role": "user", "content": question}], "sources": [], "steps": 0}
        initial_events = [
            stage("input", "completed", "Request received"),
            stage("context", "running", "Assembling conversation context"),
            stage("context", "completed", f"{len(initial['messages'])} conversation messages"),
        ]
        for event in initial_events:
            sequence += 1
            yield {**event, "run_id": run_id, "sequence": sequence, "elapsed_ms": round((time.perf_counter() - start) * 1000)}
        async for mode, update in self.graph.astream(initial, stream_mode=["custom", "updates"]):
            if mode == "custom":
                sequence += 1
                yield {**update, "run_id": run_id, "sequence": sequence, "elapsed_ms": round((time.perf_counter() - start) * 1000)}
            elif "decide" in update and not update["decide"].get("calls"):
                answer_events = [
                    stage("answer", "running", "Preparing the answer"),
                    {"type": "answer", "stage": "answer", "content": update["decide"]["answer"]},
                    stage("answer", "completed", "Answer delivered"),
                ]
                for event in answer_events:
                    sequence += 1
                    yield {**event, "run_id": run_id, "sequence": sequence, "elapsed_ms": round((time.perf_counter() - start) * 1000)}
