from dataclasses import asdict
from urllib.parse import urlsplit

from .config import Settings
from .model import TOOLS
from .workflow import MAX_STEPS, AgentWorkflow


# 公开只读配置
def workspace_snapshot(workflow: AgentWorkflow, settings: Settings) -> dict:
    chunks = [{**asdict(chunk), "id": index + 1} for index, chunk in enumerate(workflow.store.chunks)]
    models = []
    for provider in ["openai", "deepseek"]:
        base_url = getattr(settings, f"{provider}_base_url") or "https://api.openai.com/v1"
        parsed = urlsplit(base_url)
        models.append({"id": provider, "name": getattr(settings, f"{provider}_model"),
                       "configured": bool(getattr(settings, f"{provider}_api_key")), "host": parsed.hostname})
    tools = [{"name": tool["function"]["name"], "description": tool["function"]["description"],
              "parameters": tool["function"]["parameters"],
              "configured": tool["function"]["name"] != "web_search" or bool(settings.tavily_api_key)} for tool in TOOLS]
    return {"models": models, "tools": tools, "knowledge": chunks, "max_steps": MAX_STEPS,
            "storage": {"documents": "Markdown", "index": "TF-IDF cosine", "memory": "Conversation context", "persistent_chat": False}}
