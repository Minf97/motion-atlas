from pathlib import Path

from app.knowledge import VectorStore, load_chunks


def test_reviewed_documents_are_vector_searchable():
    chunks = load_chunks(Path(__file__).parents[1] / "knowledge")
    results = VectorStore(chunks).search("Pacagen RAG Agent")
    assert results
    assert results[0].title == "Minf 工作经历"


def test_unknown_question_has_no_evidence():
    chunks = load_chunks(Path(__file__).parents[1] / "knowledge")
    assert VectorStore(chunks).search("火星上的私人飞机") == []
