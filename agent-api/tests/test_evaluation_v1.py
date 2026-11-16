import asyncio
import json
from app import evaluation
from app.evaluation import load_dataset, judge_feedback, run_cases
from app.schemas import FeedbackRequest


def test_dataset_contains_required_groups():
    cases = load_dataset("v1")
    assert len(cases) == 18
    assert {case["group"] for case in cases} >= {"personal", "project", "refusal", "web", "citation", "context", "capability", "tool"}


def test_feedback_judge_scores_json():
    class Router:
        async def respond(self, provider, messages, allow_tools=True):
            return {"content": json.dumps({"correctness": .9, "relevance": .8, "evidence": .7, "tool_trajectory": .6, "judge_reason": "grounded"})}
    request = FeedbackRequest(model="deepseek", question="Q", answer="A", rating="thumbs_up")
    result = asyncio.run(judge_feedback(Router(), request))
    assert result["overall"] == .78


def test_feedback_rejects_invalid_judge_json():
    class Router:
        async def respond(self, provider, messages, allow_tools=True):
            return {"content": "not json"}
    request = FeedbackRequest(model="deepseek", question="Q", answer="A", rating="thumbs_down")
    try:
        asyncio.run(judge_feedback(Router(), request))
    except ValueError as error:
        assert "invalid JSON" in str(error)
    else:
        raise AssertionError("invalid judge output must fail")


def test_case_reports_expected_tools_and_detects_wrong_language(monkeypatch):
    monkeypatch.setattr(evaluation, "load_dataset", lambda version: [{
        "id": "english", "group": "personal", "question": "Tell me about Minf", "language": "en",
        "expected_tools": ["personal_knowledge_search"], "expected_facts": ["Minf"], "dataset_version": version,
    }])

    class Workflow:
        async def stream(self, question, provider, history):
            yield {"type": "tool", "status": "completed", "content": "web_search"}
            yield {"type": "evidence", "content": "source", "sources": [{"id": 1, "excerpt": "Minf"}]}
            yield {"type": "answer", "content": "这是中文回答 [1]"}

    result = asyncio.run(_collect_cases(Workflow()))[0]
    assert result["expected_tools"] == ["personal_knowledge_search"]
    assert result["tools"] == ["web_search"]
    assert "wrong_tool" in result["failure_categories"]
    assert "wrong_language" in result["failure_categories"]
    assert "incomplete_answer" in result["failure_categories"]


async def _collect_cases(workflow):
    return [case async for case in run_cases(workflow, "deepseek", "v1") if case["type"] == "case"]
