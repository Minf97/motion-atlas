import test from "node:test"
import assert from "node:assert/strict"
import { orbitPosition } from "../lib/orbit.ts"
import { horizontalOffset, studyMedia } from "../lib/study-media.ts"

test("camera circles the original sculpture in both scroll directions", () => {
  const start = orbitPosition(0, 5)
  const middle = orbitPosition(0.5, 5)
  const end = orbitPosition(1, 5)
  assert.ok(start[0] < 0 && end[0] > 0)
  assert.ok(middle[0] > start[0] && middle[0] < end[0])
  for (const position of [start, middle, end]) assert.ok(Math.abs(Math.hypot(position[0], position[2]) - 5) < 1e-10)
  assert.deepEqual(orbitPosition(0, 5), start)
})

test("horizontal travel reaches each panel and reverses", () => {
  assert.equal(horizontalOffset(0, 3), 0)
  assert.ok(Math.abs(horizontalOffset(0.5, 3) + 100 / 3) < 1e-10)
  assert.ok(Math.abs(horizontalOffset(1, 3) + 200 / 3) < 1e-10)
  assert.ok(Math.abs(horizontalOffset(0.5, 3) + 100 / 3) < 1e-10)
})

test("driven studies use original source material", () => {
  for (const source of Object.values(studyMedia)) {
    assert.equal(new URL(source).protocol, "https:")
    assert.doesNotMatch(source, /unsplash|interactive-examples\.mdn/)
  }
  assert.equal(studyMedia.scaleModel, "https://scfo.de/knight.glb")
})
