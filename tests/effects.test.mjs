import test from "node:test"
import assert from "node:assert/strict"
import { effects, getEffect } from "../lib/effects.ts"

test("every portfolio card has a unique working detail route", () => {
  assert.equal(effects.length, 14)
  assert.equal(new Set(effects.map(({ slug }) => slug)).size, effects.length)
  for (const effect of effects) assert.equal(getEffect(effect.slug), effect)
})

test("the requested loading, scrolling, and smooth groups are present", () => {
  assert.deepEqual(new Set(effects.map(({ category }) => category)), new Set(["loading", "scrolling", "smooth"]))
  assert.equal(effects.filter(({ category }) => category === "loading").length, 4)
  assert.equal(effects.filter(({ category }) => category === "scrolling").length, 9)
  assert.deepEqual(effects.filter(({ category }) => category === "loading").map(({ group }) => group), ["Splash", "Transition", "Transition", "Transition"])
  assert.deepEqual(effects.filter(({ category }) => category === "scrolling").map(({ group }) => group), ["Scroll Trigger", ...Array(8).fill("Scroll Driven")])
  assert.equal(effects.find(({ category }) => category === "smooth")?.group, "Lenis")
})

test("every study names an inspectable original reference", () => {
  for (const effect of effects) {
    assert.ok(effect.reference.name)
    assert.ok(effect.reference.cue)
    assert.equal(new URL(effect.reference.url).protocol, "https:")
    if (effect.reference.motionUrl) assert.equal(new URL(effect.reference.motionUrl).protocol, "https:")
  }
  assert.equal(getEffect("splash")?.reference.name, "Lusion")
})
