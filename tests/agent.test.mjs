import test from "node:test"
import assert from "node:assert/strict"
import {
  parseAgentEvent,
  splitAgentEvents,
  recommendedQuestions,
  recommendedQuestionsEn,
} from "../lib/agent.ts"

test("recommended questions cover the public agent scope in both languages", () => {
  assert.equal(recommendedQuestions.length, 6)
  assert.equal(recommendedQuestionsEn.length, 6)
  assert.match(recommendedQuestions[0], /Agent/)
  assert.match(recommendedQuestionsEn[0], /agent/i)
})

test("SSE parser ignores non-data lines and parses evidence", () => {
  assert.equal(parseAgentEvent(": keep-alive"), null)
  const event = parseAgentEvent(
    'data: {"type":"evidence","content":"found","sources":[]}'
  )
  assert.deepEqual(event, { type: "evidence", content: "found", sources: [] })
})

test("trace aggregation separates the answer and deduplicates sources", () => {
  const source = {
    id: 1,
    title: "Resume",
    kind: "resume",
    url: "/resume/",
    excerpt: "Minf",
  }
  const result = splitAgentEvents([
    { type: "plan", content: "Search resume" },
    { type: "tool", content: "personal_knowledge_search" },
    { type: "evidence", content: "Found", sources: [source] },
    { type: "answer", content: "Minf works " },
    { type: "answer", content: "on agents.", sources: [source] },
  ])
  assert.deepEqual(
    result.steps.map((event) => event.type),
    ["plan", "tool", "evidence"]
  )
  assert.equal(result.answer, "Minf works on agents.")
  assert.deepEqual(result.sources, [source])
})

// 保留不同引用编号
 test('different evidence from the same page retains every citation id', () => {
  const first = { id: 1, title: 'Minf', kind: 'resume', url: 'https://example.com/resume', excerpt: 'Agent project' }
  const second = { ...first, id: 2, excerpt: 'Frontend experience' }
  const result = splitAgentEvents([
    { type: 'evidence', content: 'Found', sources: [first, second] },
    { type: 'answer', content: 'Answer [1][2]', sources: [first, second] },
  ])
  assert.deepEqual(result.sources, [first, second])
})
