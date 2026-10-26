import test from "node:test"
import assert from "node:assert/strict"
import * as zh from "../lib/resume.ts"
import * as en from "../lib/resume-en.ts"
import { effects } from "../lib/effects.ts"
import { effectDescriptions } from "../lib/effects-en.ts"

test("English resume preserves contacts and the complete career history", () => {
  assert.equal(en.profile.name, "Minf")
  for (const field of ["email", "phone", "github", "blog", "portfolio"]) assert.equal(en.profile[field], zh.profile[field])
  assert.equal(en.experience.length, zh.experience.length)
  assert.equal(en.projects.length, zh.projects.length)
  assert.equal(en.profile.skills.length, zh.profile.skills.length)
  for (const collection of [en.experience, en.projects]) {
    for (const entry of collection) {
      assert.ok(entry.date)
      assert.ok(entry.details.every(detail => detail.length > 20))
    }
  }
  assert.equal(en.profile.phone, "18938878019")
})

test("English translation keeps the stated outcomes and scale", () => {
  assert.match(en.experience[0].details.join(" "), /8–12.*1–4/)
  assert.match(en.experience[1].details.join(" "), /\$3,700.*\$1,000|\$1,000.*\$3,700/)
  assert.match(en.projects[1].details[0], /300,000.*20,000/)
  assert.match(en.projects[2].details[0], /2,000 USDT/)
  assert.match(en.projects[3].details[0], /second prize.*top 10/)
})

test("each interaction study has an English description", () => {
  assert.equal(effectDescriptions.length, effects.length)
  effects.forEach(effect => assert.ok(effectDescriptions[Number(effect.number) - 1].length > 20))
})
