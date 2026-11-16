import json
import re
import time
from pathlib import Path
from uuid import uuid4

DATASET_DIR = Path(__file__).resolve().parent.parent / "evals"

def load_dataset(version: str = "v1") -> list[dict]:
    path = DATASET_DIR / f"{version}.json"
    if not path.exists():
        raise ValueError(f"Unknown dataset version: {version}")
    return json.loads(path.read_text())

def _sources(events: list[dict]) -> list[dict]:
    return [source for event in events if event.get("type") == "evidence" for source in event.get("sources", [])]

def _failure_categories(case: dict, checks: dict, error: str | None = None) -> list[str]:
    failures = []
    if error: failures.append("tool_error")
    if not checks.get("correct_tool", True): failures.append("wrong_tool")
    if not checks.get("has_evidence", True) and not case.get("must_refuse"): failures.append("missing_evidence")
    if not checks.get("cited_source", True) and not case.get("must_refuse"): failures.append("invalid_citation")
    if not checks.get("answered"): failures.append("incomplete_answer")
    if not checks.get("expected_facts"): failures.append("incomplete_answer")
    if not checks.get("language", True): failures.append("wrong_language")
    if case.get("must_refuse") and not checks.get("refused"): failures.append("fabrication_risk")
    return failures

async def run_cases(workflow, provider: str, dataset_version: str | None = None):
    if dataset_version is None:
        dataset_version = "legacy"
        cases = [{"id": "profile", "group": "personal", "question": "Minf 在 Pacagen 负责什么？", "expected_tools": ["personal_knowledge_search"]}, {"id": "web", "group": "web", "question": "Python 官方网站目前显示的最新稳定版本是什么？", "expected_tools": ["web_search"]}]
    else:
        cases = load_dataset(dataset_version)
    run_id = uuid4().hex
    results = []
    run_start = time.perf_counter()
    for case in cases:
        start = time.perf_counter(); error = None
        try:
            events = [event async for event in workflow.stream(case["question"], provider, [])]
        except Exception as exc:
            events, error = [], str(exc)
        sources = _sources(events)
        tools = [e["content"] for e in events if e.get("type") == "tool" and e.get("status") == "completed"]
        answers = [e["content"] for e in events if e.get("type") == "answer"]
        answer = answers[-1] if answers else ""
        cited = {int(n) for n in re.findall(r"\[(\d+)\]", answer)}
        source_ids = {source.get("id") for source in sources}
        haystack = answer.lower()
        required_sources = case.get("required_sources", [])
        source_refs = {str(value) for source in sources for value in (source.get("url"), source.get("title"))}
        checks = {
            "correct_tool": set(tools) == set(case.get("expected_tools", [])),
            "has_evidence": bool(sources), "answered": bool(answer.strip()),
            "cited_source": (not sources or (bool(cited) and cited <= source_ids)) and all(str(source) in source_refs for source in required_sources),
            "expected_facts": all(str(f).lower() in haystack for f in case.get("expected_facts", [])) or not case.get("expected_facts"),
            "language": (bool(re.search(r"[\u4e00-\u9fff]", answer)) if case.get("language") == "zh" else not bool(re.search(r"[\u4e00-\u9fff]", answer))) if case.get("language") in ("zh", "en") else True,
            "refused": ("没有确认" in answer or "无法确认" in answer or "not confirmed" in answer.lower()) if case.get("must_refuse") else True,
        }
        failures = _failure_categories(case, checks, error)
        scores = {"tool_selection": float(checks["correct_tool"]), "evidence": float(checks["has_evidence"] or case.get("must_refuse")), "grounded_citation": float(checks["cited_source"]), "answer_quality": float(checks["answered"] and checks["expected_facts"])}
        duration_ms = round((time.perf_counter() - start) * 1000)
        spans = [{key: event.get(key) for key in ("type", "stage", "status", "content", "query", "sources", "run_id", "span_id", "parent_span_id", "sequence", "model", "duration_ms", "error")} for event in events]
        result = {"type": "case", "id": case["id"], "group": case["group"], "language": case.get("language"), "dataset_version": dataset_version, "run_id": run_id, "model": provider, "question": case["question"], "passed": not failures, "checks": checks, "failure_categories": failures, "scores": scores, "expected_tools": case.get("expected_tools", []), "tools": tools, "sources": sources, "trace": {"events": len(events), "tool_calls": len(tools), "evidence": len(sources), "answer_chars": len(answer), "spans": spans}, "duration_ms": duration_ms, "error": error}
        results.append(result); yield result
    total = len(results)
    all_scores = [value for item in results for value in item["scores"].values()]
    failures = {}
    for item in results:
        for category in item["failure_categories"]: failures[category] = failures.get(category, 0) + 1
    yield {"type": "summary", "id": run_id, "run_id": run_id, "model": provider, "dataset_version": dataset_version, "cases": total, "passed": sum(item["passed"] for item in results), "pass_rate": sum(item["passed"] for item in results) / total, "scores": {name: sum(item["scores"][name] for item in results) / total for name in results[0]["scores"]}, "overall_score": sum(all_scores) / len(all_scores), "average_score": sum(all_scores) / len(all_scores), "average_latency_ms": round(sum(item["duration_ms"] for item in results) / total), "failure_counts": failures, "tool_error_rate": failures.get("tool_error", 0) / total, "duration_ms": round((time.perf_counter() - run_start) * 1000)}

async def judge_feedback(router, request) -> dict:
    trace = [{key: event.get(key) for key in ("type", "stage", "status", "content", "query", "sources", "duration_ms")} for event in request.events]
    prompt = {
        "question": request.question, "answer": request.answer, "rating": request.rating,
        "user_reason": request.reason, "auditable_trace": trace,
        "instruction": "Score correctness, relevance, evidence, and tool_trajectory from 0 to 1. Return only JSON with those four numbers and judge_reason. Do not infer facts absent from trace.",
    }
    reply = await router.respond(request.model, [{"role": "user", "content": json.dumps(prompt, ensure_ascii=False)}], allow_tools=False)
    try:
        result = json.loads(reply["content"])
        names = ("correctness", "relevance", "evidence", "tool_trajectory")
        if any(not isinstance(result.get(name), (int, float)) or not 0 <= result[name] <= 1 for name in names):
            raise ValueError("Judge scores must be numbers from 0 to 1")
        if not isinstance(result.get("judge_reason"), str) or not result["judge_reason"].strip():
            raise ValueError("Judge reason is required")
    except (json.JSONDecodeError, KeyError, TypeError) as error:
        raise ValueError("Judge returned invalid JSON") from error
    result["overall"] = round(result["correctness"] * .35 + result["relevance"] * .25 + result["evidence"] * .25 + result["tool_trajectory"] * .15, 4)
    return result
