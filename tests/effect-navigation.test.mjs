import test from "node:test"
import assert from "node:assert/strict"
import { effects, getEffectNavigation } from "../lib/effects.ts"

test("every effect navigates in catalogue order and wraps at both ends", () => {
  for (const [index, effect] of effects.entries()) {
    const nav = getEffectNavigation(effect.slug)
    assert.equal(nav.previous, effects[(index - 1 + effects.length) % effects.length])
    assert.equal(nav.next, effects[(index + 1) % effects.length])
    assert.equal(nav.home, "/#work")
  }
})

test("English navigation preserves locale and unknown cases fail explicitly", () => {
  const nav = getEffectNavigation("smooth-scroll", true)
  assert.equal(nav.home, "/en/#work")
  assert.equal(nav.prefix, "/en")
  assert.equal(nav.next.slug, "splash")
  assert.throws(() => getEffectNavigation("missing"), /Unknown effect/)
})
