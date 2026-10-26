import asyncio
import json
from pathlib import Path

from app.evaluation import run_cases
from app.workflow import AgentWorkflow


class FakeRouter:
    async def respond(self, provider, messages, allow_tools=True):
        if messages[-1]["role"] == "user":
            name = "web_search" if "Python" in messages[-1]["content"] else "personal_knowledge_search"
            return {"role": "assistant", "tool_calls": [{"id": "one", "type": "function", "function": {"name": name, "arguments": json.dumps({"query": messages[-1]["content"]})}}]}
        return {"role": "assistant", "content": "Verified answer [1]"}


class FakeTools:
    async def run(self, name, query):
        return [{"title": "Evidence", "kind": name, "url": "https://example.com", "excerpt": query}]


def make_workflow(router=None, tools=None):
    return AgentWorkflow(Path(__file__).parents[1] / "knowledge", router or FakeRouter(), tools or FakeTools())


async def collect(stream):
    return [event async for event in stream]


def test_personal_question_uses_knowledge_tool_and_traces_it():
    events = asyncio.run(collect(make_workflow().stream("你在 Pacagen 负责什么？", "openai")))
    actions = [event for event in events if event["type"] != "stage"]
    assert [event["type"] for event in actions] == ["plan", "tool", "tool", "evidence", "answer"]
    assert actions[1]["content"] == "personal_knowledge_search"
    assert actions[2]["sources"][0]["url"] == "https://example.com"


def test_external_question_uses_web_search_and_evaluation_reports_checks():
    results = asyncio.run(collect(run_cases(make_workflow(), "deepseek")))
    cases = [result for result in results if result["type"] == "case"]
    summary = results[-1]
    assert len(cases) == 2
    assert all(result["passed"] for result in cases)
    assert cases[1]["tools"] == ["web_search"]
    assert summary["type"] == "summary"
    assert summary["pass_rate"] == 1
