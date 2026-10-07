import test from "node:test"
import assert from "node:assert/strict"
import { amaterasuFrame, amaterasuFrameCount, amaterasuFrameDuration, amaterasuFrameUrl, amaterasuPageName } from "../lib/amaterasu.ts"

test("Amaterasu image sequence covers and reveals at 30 fps", () => {
  assert.equal(amaterasuFrameCount, 90)
  assert.equal(amaterasuFrame(-10), 0)
  assert.equal(amaterasuFrame(0), 0)
  assert.equal(amaterasuFrame(amaterasuFrameDuration * 45), 45)
  assert.equal(amaterasuFrame(amaterasuFrameDuration * 100), 89)
  assert.equal(amaterasuFrameUrl(45), "https://amaterasu.ai/img/transition/transition-45.webp")
  assert.throws(() => amaterasuFrameUrl(90))
})

test("Amaterasu navigation identifies the visible page", () => {
  assert.equal(amaterasuPageName(0), "Vision")
  assert.equal(amaterasuPageName(1), "Aleph")
  assert.throws(() => amaterasuPageName(2))
})
