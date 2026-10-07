import test from "node:test"
import assert from "node:assert/strict"
import { scrollProgress, videoTime } from "../lib/progress.ts"

test("scroll progress follows the full sticky travel in both directions", () => {
  assert.equal(scrollProgress(0, 2600, 1000), 0)
  assert.equal(scrollProgress(-800, 2600, 1000), 0.5)
  assert.equal(scrollProgress(-1600, 2600, 1000), 1)
  assert.equal(scrollProgress(-800, 2600, 1000), 0.5)
})

test("scroll and video values stay within their ranges", () => {
  assert.equal(scrollProgress(100, 2600, 1000), 0)
  assert.equal(scrollProgress(-2000, 2600, 1000), 1)
  assert.equal(scrollProgress(-10, 500, 1000), 0)
  assert.equal(videoTime(0.25, 8), 2)
  assert.equal(videoTime(1.5, 8), 8)
})
