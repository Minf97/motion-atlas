import test from "node:test"
import assert from "node:assert/strict"
import { isPortfolioTransition, nextPageTransition, pageTransitionPlaybackRate } from "../lib/page-transition.ts"
import { amaterasuCoverFrame, amaterasuFrame, amaterasuFrameCount } from "../lib/amaterasu.ts"

test("faster playback covers at 750ms and finishes within 1.5 seconds", () => {
  assert.equal(amaterasuFrame(750 * pageTransitionPlaybackRate), amaterasuCoverFrame)
  assert.equal(amaterasuFrame(1500 * pageTransitionPlaybackRate), amaterasuFrameCount - 1)
})

test("collection and resume transitions support both languages and trailing slashes", () => {
  assert.equal(isPortfolioTransition("/", "/resume"), true)
  assert.equal(isPortfolioTransition("/resume/", "/"), true)
  assert.equal(isPortfolioTransition("/en/", "/en/resume/"), true)
  assert.equal(isPortfolioTransition("/en/resume", "/en"), true)
  assert.equal(isPortfolioTransition("/resume/", "/resume"), false)
  assert.equal(isPortfolioTransition("/effects/mask-transition", "/"), false)
})

test("mask stays covered until the destination commits", () => {
  assert.equal(nextPageTransition("idle", "start"), "covering")
  assert.equal(nextPageTransition("covering", "navigated"), "covering")
  assert.equal(nextPageTransition("covering", "covered"), "covered")
  assert.equal(nextPageTransition("covered", "revealed"), "covered")
  assert.equal(nextPageTransition("covered", "navigated"), "revealing")
  assert.equal(nextPageTransition("revealing", "start"), "revealing")
  assert.equal(nextPageTransition("revealing", "revealed"), "idle")
})
