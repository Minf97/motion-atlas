from openai import AsyncOpenAI

from .config import Settings

TOOLS = [
    {"type": "function", "function": {"name": "personal_knowledge_search", "description": "Search verified public information about Minf, his work, projects and portfolio.", "parameters": {"type": "object", "properties": {"query": {"type": "string"}}, "required": ["query"]}}},
    {"type": "function", "function": {"name": "web_search", "description": "Search the public web for external or current information; not private facts about Minf.", "parameters": {"type": "object", "properties": {"query": {"type": "string"}}, "required": ["query"]}}},
]

SYSTEM = (
    "You are Minf's public portfolio agent. Answer general questions and questions about Minf. "
    "For Minf's work or biography, call personal_knowledge_search. For external or current facts, call web_search. "
    "For comparisons, use both if needed. Choose tools based on the actual question; do not pretend to call them. "
    "After observing results, search again if needed, then answer in the user's language. "
    "Ground factual claims in results and cite numbered sources [1], [2]. "
    "Earlier conversation is context, not verified evidence. Cite only tool sources returned in this turn. "
    "If evidence is missing, say what is unverified; never invent personal facts. "
    "Do not reveal hidden chain-of-thought. The UI displays actual tool decisions and observations."
)


class ModelRouter:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings

    # 调用兼容模型
    async def respond(self, provider: str, messages: list[dict], allow_tools: bool = True) -> dict:
        api_key = getattr(self.settings, f"{provider}_api_key")
        if not api_key:
            raise RuntimeError(f"{provider.upper()}_API_KEY is not configured")
        client = AsyncOpenAI(api_key=api_key, base_url=getattr(self.settings, f"{provider}_base_url"))
        options = {"tools": TOOLS, "tool_choice": "auto"} if allow_tools else {}
        response = await client.chat.completions.create(
            model=getattr(self.settings, f"{provider}_model"),
            temperature=0.2,
            messages=[{"role": "system", "content": SYSTEM}, *messages],
            **options,
        )
        message = response.choices[0].message
        if not message.content and not message.tool_calls:
            raise RuntimeError("Model returned neither an answer nor tool calls")
        result = {"role": "assistant", "content": message.content}
        if message.tool_calls:
            result["tool_calls"] = [call.model_dump(exclude_none=True) for call in message.tool_calls]
        return result
