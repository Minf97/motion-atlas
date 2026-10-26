from typing import Literal

from pydantic import BaseModel, Field


ModelName = Literal["openai", "deepseek"]


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=20000)


class ChatRequest(BaseModel):
    question: str = Field(min_length=1, max_length=1000)
    model: ModelName = "openai"
    history: list[ChatMessage] = Field(default_factory=list, max_length=20)


class Source(BaseModel):
    title: str
    kind: str
    url: str
    excerpt: str
