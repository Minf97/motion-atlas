from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

import asyncio
import pytest

from app.config import Settings
from app.model import ModelRouter


@pytest.mark.parametrize("key,expected", [("", ["personal_knowledge_search"]), ("test-key", ["personal_knowledge_search", "web_search"])])
def test_model_only_receives_configured_tools(key, expected):
    message = SimpleNamespace(content="Answer", tool_calls=None)
    create = AsyncMock(return_value=SimpleNamespace(choices=[SimpleNamespace(message=message)]))
    client = SimpleNamespace(chat=SimpleNamespace(completions=SimpleNamespace(create=create)))
    settings = Settings(_env_file=None, deepseek_api_key="test", tavily_api_key=key)
    with patch("app.model.AsyncOpenAI", return_value=client):
        asyncio.run(ModelRouter(settings).respond("deepseek", [{"role": "user", "content": "Hello"}]))
    assert [tool["function"]["name"] for tool in create.call_args.kwargs["tools"]] == expected
