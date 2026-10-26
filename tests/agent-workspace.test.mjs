import test from "node:test"
import assert from "node:assert/strict"
import { stageStates, toolCalls, conversationHistory, filterKnowledge, agentSections } from "../lib/agent-workspace.ts"
import { readEventStream } from "../lib/agent-stream.ts"
import { parseAgentEvent } from "../lib/agent.ts"

const turn = (events, status = "running") => ({ id: "turn", question: "Minf?", model: "deepseek", events, status, duration_ms: 10 })

test("workspace navigation exposes the six requested components", () => {
  assert.deepEqual(agentSections, ["Overview", "Loop", "Memory", "Tool", "Database", "Settings"])
})

test("real stage starts, completions and repeated cycles drive the graph", () => {
  const events = [
    { type: "stage", stage: "model", status: "completed", content: "decided" },
    { type: "stage", stage: "tools", status: "completed", content: "executed" },
    { type: "stage", stage: "observe", status: "completed", content: "observed" },
    { type: "stage", stage: "model", status: "running", content: "next cycle", cycle: 2 },
  ]
  const state = stageStates(turn(events))
  assert.equal(state.model, "running")
  assert.equal(state.tools, "completed")
  assert.equal(state.answer, "pending")
})

test("failures and cancellations never leave a running graph node", () => {
  const events = [{ type: "stage", stage: "tools", status: "running", content: "start" }]
  assert.equal(stageStates(turn(events, "error")).tools, "error")
  assert.equal(stageStates(turn(events, "cancelled")).tools, "cancelled")
  assert.equal(stageStates(turn([...events, { type: "error", stage: "tools", content: "failed" }], "error")).tools, "error")
})

test("tool history correlates start and result by call id across loop cycles", () => {
  const events = [
    { type: "tool", call_id: "a", content: "web_search", status: "running", query: "Python" },
    { type: "tool", call_id: "a", content: "web_search", status: "completed", query: "Python", duration_ms: 80, sources: [] },
    { type: "tool", call_id: "b", content: "web_search", status: "running", query: "release" },
  ]
  const calls = toolCalls(events)
  assert.equal(calls.length, 2)
  assert.equal(calls[0].status, "completed")
  assert.equal(calls[0].duration_ms, 80)
  assert.equal(calls[1].query, "release")
})

test("conversation context contains completed answers only and is limited to 20 messages", () => {
  const completed = turn([{ type: "answer", content: "Minf is an engineer" }], "completed")
  const history = conversationHistory([turn([], "error"), ...Array(12).fill(completed)])
  assert.equal(history.length, 20)
  assert.equal(history[0].role, "user")
  assert.equal(history[1].content, "Minf is an engineer")
  assert.equal(conversationHistory([turn([], "cancelled")]).length, 0)
})

test("database filters actual document title and body", () => {
  const chunks = [{ title: "Resume", text: "Pacagen" }, { title: "Projects", text: "We campus" }]
  assert.deepEqual(filterKnowledge(chunks, " pacagen "), [chunks[0]])
  assert.deepEqual(filterKnowledge(chunks, "PROJECT"), [chunks[1]])
  assert.deepEqual(filterKnowledge(chunks, "unknown"), [])
})

test("SSE decoding preserves split UTF-8, CRLF frames and a final un-delimited answer", async () => {
  const raw = 'data: {"type":"plan","content":"选择工具"}\r\n\r\ndata: {"type":"answer","content":"Minf"}'
  const bytes = new TextEncoder().encode(raw)
  const stream = new ReadableStream({
    start(controller) {
      for (let offset = 0; offset < bytes.length; offset += 3) controller.enqueue(bytes.slice(offset, offset + 3))
      controller.close()
    },
  })
  const events = []
  await readEventStream(new Response(stream), frame => { const event = parseAgentEvent(frame); if (event) events.push(event) })
  assert.deepEqual(events.map(event => event.content), ["选择工具", "Minf"])
})

test("HTTP and malformed stream failures reject explicitly", async () => {
  await assert.rejects(readEventStream(new Response("", { status: 503 }), () => {}), /503/)
  await assert.rejects(readEventStream(new Response("data: not-json\n\n"), parseAgentEvent), SyntaxError)
})
