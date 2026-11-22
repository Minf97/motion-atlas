import test from "node:test"
import assert from "node:assert/strict"
import { experience, profile, projects } from "../lib/resume.ts"
import * as en from "../lib/resume-en.ts"

test("public resume keeps the verified contact details from the source brief", () => {
  assert.equal(profile.name, "胥昱全")
  assert.equal(profile.email, "287728237@qq.com")
  assert.equal(profile.github, "https://github.com/Minf97")
  assert.equal(profile.phone, "18938878019")
  assert.equal(profile.portfolio, "https://minf97.github.io/motion-atlas/")
})

test("resume keeps the updated work timeline without descriptions in either language", () => {
  assert.deepEqual(experience, [
    { company: "蔚灵深度科技有限公司", role: "Agent / 全栈工程师", date: "2025.12 — 至今" },
    { company: "Pacagen — New York", role: "Software Engineer", date: "2025.05 — 2025.12" },
    { company: "深圳用图科技有限公司", role: "前端 K 线工程师", date: "2024.02 — 2025.03" },
    { company: "深圳四博智联科技有限公司", role: "前端工程师", date: "2022.10 — 2024.02" },
  ])
  assert.deepEqual(en.experience.map(item => item.date), ["Dec 2025 — Present", "May 2025 — Dec 2025", "Feb 2024 — Mar 2025", "Oct 2022 — Feb 2024"])
  assert.deepEqual(en.experience.slice(2).map(item => item.company), experience.slice(2).map(item => item.company))
  for (const item of [...experience, ...en.experience]) {
    assert.deepEqual(Object.keys(item).sort(), ["company", "date", "role"])
    assert.ok(item.role.trim())
  }
})

test("both resumes remove Insight Copilot and preserve other project details", () => {
  assert.deepEqual(projects.map(({ name }) => name), ["We 校园", "MurmRay", "Agora Space"])
  assert.deepEqual(en.projects.map(({ name }) => name), ["We Campus", "MurmRay", "Agora Space"])
  for (const item of [...projects, ...en.projects]) {
    assert.ok(item.date)
    assert.ok(item.details.length)
  }
})
