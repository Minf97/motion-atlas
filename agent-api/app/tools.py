import httpx

from .config import Settings
from .knowledge import VectorStore


class AgentTools:
    def __init__(self, store: VectorStore, settings: Settings) -> None:
        self.store = store
        self.settings = settings

    # 执行只读工具
    async def run(self, name: str, query: str) -> list[dict]:
        if name == "personal_knowledge_search":
            return [
                {"title": item.title, "kind": item.kind, "url": item.url, "excerpt": item.text}
                for item in self.store.search(query)
            ]
        if name == "web_search":
            if not self.settings.tavily_api_key:
                raise RuntimeError("TAVILY_API_KEY is not configured")
            async with httpx.AsyncClient(timeout=15) as client:
                response = await client.post(
                    "https://api.tavily.com/search",
                    headers={"Authorization": f"Bearer {self.settings.tavily_api_key}"},
                    json={"query": query, "search_depth": "basic", "max_results": 4},
                )
                response.raise_for_status()
                payload = response.json()
            return [
                {"title": item["title"], "kind": "web", "url": item["url"], "excerpt": item["content"]}
                for item in payload["results"]
            ]
        raise ValueError(f"Unknown tool: {name}")
