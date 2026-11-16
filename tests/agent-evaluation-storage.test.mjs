import test from "node:test"
import assert from "node:assert/strict"
import { readEvaluationRuns, saveEvaluationRun, saveFeedback } from "../lib/agent-evaluation-storage.ts"

function memoryStorage() {
  const values = new Map()
  globalThis.localStorage = {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  }
}

test("evaluation history retains only the five newest runs", () => {
  memoryStorage()
  for (let index = 0; index < 6; index += 1) {
    saveEvaluationRun({ saved_at: String(index), cases: [], summary: { id: String(index), run_id: String(index), model: "deepseek", duration_ms: 0 } })
  }
  assert.deepEqual(readEvaluationRuns().map(run => run.saved_at), ["5", "4", "3", "2", "1"])
})

test("feedback history stores rating and auditable events, capped at twenty", () => {
  memoryStorage()
  for (let index = 0; index < 21; index += 1) {
    saveFeedback({ saved_at: String(index), turn_id: String(index), question: "Q", answer: "A", events: [{ type: "tool" }], rating: "thumbs_up" })
  }
  const saved = JSON.parse(localStorage.getItem("minf-agent-feedback-v1"))
  assert.equal(saved.length, 20)
  assert.equal(saved[0].turn_id, "20")
  assert.deepEqual(saved[0].events, [{ type: "tool" }])
})
