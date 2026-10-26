import math
import re
from dataclasses import dataclass
from pathlib import Path

TOKEN_RE = re.compile(r"[\w\u4e00-\u9fff]+", re.UNICODE)


@dataclass(frozen=True)
class Chunk:
    title: str
    kind: str
    url: str
    text: str


def _tokens(text: str) -> list[str]:
    tokens = [token.lower() for token in TOKEN_RE.findall(text)]
    return [part for token in tokens for part in (
        [token[index:index + 2] for index in range(len(token) - 1)]
        if any("\u4e00" <= char <= "\u9fff" for char in token) else [token]
    )]


def load_chunks(directory: Path) -> list[Chunk]:
    chunks: list[Chunk] = []
    for path in sorted(directory.glob("*.md")):
        raw = path.read_text(encoding="utf-8")
        metadata, _, body = raw.partition("\n\n")
        values = dict(line.split(": ", 1) for line in metadata.splitlines() if ": " in line)
        for paragraph in re.split(r"\n\s*\n", body):
            text = paragraph.strip()
            if text:
                chunks.append(Chunk(values["title"], values["kind"], values["url"], text))
    if not chunks:
        raise RuntimeError(f"No knowledge chunks found in {directory}")
    return chunks


class VectorStore:
    """小型审核语料的 TF-IDF 向量检索。"""

    def __init__(self, chunks: list[Chunk]) -> None:
        self.chunks = chunks
        self.documents = [_tokens(chunk.text) for chunk in chunks]
        vocabulary = sorted({token for document in self.documents for token in document})
        self.idf = {token: math.log((1 + len(chunks)) / (1 + sum(token in document for document in self.documents))) + 1 for token in vocabulary}
        self.vectors = [self._vector(document) for document in self.documents]

    def _vector(self, tokens: list[str]) -> dict[str, float]:
        counts = {token: tokens.count(token) for token in set(tokens)}
        return {token: count * self.idf[token] for token, count in counts.items() if token in self.idf}

    @staticmethod
    def _cosine(left: dict[str, float], right: dict[str, float]) -> float:
        numerator = sum(value * right.get(token, 0) for token, value in left.items())
        denominator = math.sqrt(sum(value * value for value in left.values())) * math.sqrt(sum(value * value for value in right.values()))
        return numerator / denominator if denominator else 0

    def search(self, query: str, limit: int = 4) -> list[Chunk]:
        query_vector = self._vector(_tokens(query))
        scored = sorted(((self._cosine(query_vector, vector), chunk) for vector, chunk in zip(self.vectors, self.chunks)), key=lambda item: item[0], reverse=True)
        return [chunk for score, chunk in scored if score > 0][:limit]
