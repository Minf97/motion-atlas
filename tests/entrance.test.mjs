import test from "node:test"
import assert from "node:assert/strict"
import { entranceDrawingDuration, entranceStrokes, nextEntrancePhase } from "../lib/entrance.ts"

test("the complete Minf signature draws in order before entry becomes ready", () => {
  assert.deepEqual(entranceStrokes.slice(0, 4).map(stroke => stroke.letter), ["M", "i", "n", "f"])
  for (let index = 1; index < entranceStrokes.length; index++) {
    const previous = entranceStrokes[index - 1]
    assert.ok(entranceStrokes[index].delay >= previous.delay + previous.duration)
  }
  const last = entranceStrokes.at(-1)
  assert.ok(entranceDrawingDuration >= last.delay + last.duration)
})

test("entrance waits for readiness before entering and removes the curtain after exit", () => {
  assert.equal(nextEntrancePhase("loading", "enter"), "loading")
  assert.equal(nextEntrancePhase("loading", "loaded"), "ready")
  assert.equal(nextEntrancePhase("ready", "enter"), "leaving")
  assert.equal(nextEntrancePhase("leaving", "finished"), "done")
})

test("late readiness and repeated clicks cannot restart or interrupt the exit", () => {
  assert.equal(nextEntrancePhase("leaving", "loaded"), "leaving")
  assert.equal(nextEntrancePhase("leaving", "enter"), "leaving")
  assert.equal(nextEntrancePhase("done", "enter"), "done")
})
