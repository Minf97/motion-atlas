import re
import time
from uuid import uuid4

CASES = [
    {"id": "profile", "question": "Minf 在 Pacagen 负责什么？", "expected_tool": "personal_knowledge_search"},
    {"id": "web", "question": "Python 官方网站目前显示的最新稳定版本是什么？", "expected_tool": "web_search"},
]


# 依据真实轨迹评分
async def run_cases(workflow, provider: str):
    run_id = uuid4().hex
    results = []
    for case in CASES:
        start = time.perf_counter()
        events = [event async for event in workflow.stream(case["question"], provider)]
        tools = [event["content"] for event in events if event["type"] == "tool" and event.get("status") == "completed"]
        sources = [source for event in events if event["type"] == "evidence" for source in event["sources"]]
        answers = [event["content"] for event in events if event["type"] == "answer"]
        cited = {int(number) for number in re.findall(r"\[(\d+)\]", answers[0])} if answers else set()
        source_ids = {source["id"] for source in sources}
        checks = {
            "correct_tool": case["expected_tool"] in tools,
            "has_evidence": bool(sources),
            "answered": len(answers) == 1 and bool(answers[0].strip()),
            "cited_source": bool(cited) and cited <= source_ids,
        }
        duration_ms = round((time.perf_counter() - start) * 1000)
        scores = {
            "tool_selection": float(checks["correct_tool"]),
            "evidence": float(checks["has_evidence"]),
            "grounded_citation": float(checks["cited_source"]),
            "answer_quality": float(checks["answered"]),
        }
        result = {"type": "case", "id": case["id"], "run_id": run_id, "model": provider,
                  "question": case["question"], "passed": all(checks.values()), "checks": checks,
                  "scores": scores, "tools": tools, "trace": {"events": len(events), "tool_calls": len(tools),
                  "evidence": len(sources), "answer_chars": len(answers[0]) if answers else 0},
                  "duration_ms": duration_ms}
        results.append(result)
        yield result
    all_scores = [score for result in results for score in result["scores"].values()]
    yield {"type": "summary", "id": run_id, "run_id": run_id, "model": provider, "cases": len(results),
           "passed": sum(1 for result in results if result["passed"]), "pass_rate": sum(1 for result in results if result["passed"]) / len(results),
           "scores": {name: sum(result["scores"][name] for result in results) / len(results) for name in results[0]["scores"]},
           "overall_score": sum(all_scores) / len(all_scores), "duration_ms": sum(result["duration_ms"] for result in results)}
