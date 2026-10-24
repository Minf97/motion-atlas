import test from "node:test"
import assert from "node:assert/strict"
import { experience, profile, projects } from "../lib/resume.ts"

test("public resume keeps the verified contact details from the source brief", () => {
  assert.equal(profile.name, "胥昱全")
  assert.equal(profile.email, "287728237@qq.com")
  assert.equal(profile.github, "https://github.com/Minf97")
  assert.equal(profile.phone, "18938878019")
  assert.equal(profile.portfolio, "https://minf97.github.io/motion-atlas/")
})

test("resume covers all documented work and projects", () => {
  assert.deepEqual(experience.map(({ company }) => company), ["蔚灵深度科技有限公司", "Pacagen — New York"])
  assert.deepEqual(projects.map(({ name }) => name), ["Insight Copilot", "We 校园", "MurmRay", "Agora Space"])
  for (const item of [...experience, ...projects]) {
    assert.ok(item.date)
    assert.ok(item.details.length)
  }
})
