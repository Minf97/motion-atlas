import test from "node:test"
import assert from "node:assert/strict"
import { experience, profile, projects } from "../lib/resume.ts"

test("public resume keeps verified contact details without publishing a phone number", () => {
  assert.equal(profile.name, "胥昱全")
  assert.equal(profile.email, "287728237@qq.com")
  assert.equal(profile.github, "https://github.com/Minf97")
  assert.doesNotMatch(JSON.stringify({ profile, experience, projects }), /18938878019/)
})

test("resume covers all documented work and projects", () => {
  assert.deepEqual(experience.map(({ company }) => company), ["蔚灵深度科技有限公司", "Pacagen", "深圳朋圈科技有限公司", "深圳四博智联科技有限公司"])
  assert.deepEqual(projects.map(({ name }) => name), ["We 校园", "MurmRay", "Agora Space", "We AI"])
  for (const item of [...experience, ...projects]) {
    assert.ok(item.date)
    assert.ok(item.details.length)
  }
})
