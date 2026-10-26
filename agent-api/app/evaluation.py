import re
import time

CASES = [
    {"id": "profile", "question": "Minf 在 Pacagen 负责什么？", "expected_tool": "personal_knowledge_search"},
    {"id": "web", "question": "Python 官方网站目前显示的最新稳定版本是什么？", "expected_tool": "web_search"},
]


# 依据真实轨迹评分
async def run_cases(workflow, provider: str):
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
        yield {"id": case["id"], "question": case["question"], "passed": all(checks.values()), "checks": checks, "tools": tools, "duration_ms": round((time.perf_counter() - start) * 1000)}
