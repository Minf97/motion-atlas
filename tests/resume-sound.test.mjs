import test from "node:test"
import assert from "node:assert/strict"
import { bindResumeSound } from "../lib/resume-sound.ts"

test("hover sound plays once per target entry after activation and cleans up", () => {
  let listener
  let plays = 0
  let pauses = 0
  let activated = false
  const page = {
    contains: () => true,
    addEventListener: (name, callback) => { assert.equal(name, "pointerover"); listener = callback },
    removeEventListener: (name, callback) => { assert.equal(callback, listener); listener = undefined },
  }
  const audio = { currentTime: 1, play: () => { plays++; return Promise.resolve() }, pause: () => { pauses++ } }
  const cleanup = bindResumeSound(page, audio, () => activated)
  const target = { closest: () => target }
  listener({ target, relatedTarget: null, pointerType: "mouse" })
  assert.equal(plays, 0)
  activated = true
  listener({ target, relatedTarget: null, pointerType: "mouse" })
  assert.equal(plays, 1)
  assert.equal(audio.currentTime, 0)
  listener({ target, relatedTarget: target, pointerType: "mouse" })
  listener({ target, relatedTarget: null, pointerType: "touch" })
  listener({ target: { closest: () => null }, relatedTarget: null, pointerType: "mouse" })
  assert.equal(plays, 1)
  listener({ target, relatedTarget: null, pointerType: "mouse" })
  assert.equal(plays, 2)
  cleanup()
  assert.equal(listener, undefined)
  assert.equal(pauses, 1)
})
