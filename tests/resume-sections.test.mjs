import test from "node:test"
import assert from "node:assert/strict"
import * as zh from "../lib/resume.ts"
import * as en from "../lib/resume-en.ts"

test("personal evaluation preserves the three requested strengths", () => {
  assert.deepEqual(zh.selfEvaluation.map(item => item.title), ["懂用户", "善数据", "能落地"])
  assert.deepEqual(zh.selfEvaluation.map(item => item.description), [
    "具备电商增长与 AI 建站产品实践，能从用户操作路径和运营需求出发，将业务问题拆解为可交付的功能与流程。",
    "具备事件建模、转化漏斗、A/B Test 与 RAG 效果评估经验，关注指标口径、实验结果及业务成本，用数据检验产品与模型效果。",
    "具备 Python / TypeScript 全栈研发能力，参与打通 Agent 编排、上下文管理、工具执行、云沙箱、数据后台与在线预览链路。",
  ])
  assert.equal(en.selfEvaluation.length, 3)
  for (const item of en.selfEvaluation) assert.ok(item.title && item.description)
})

test("both skill catalogues contain all user supplied skills as individual tags", () => {
  const requested = ["JavaScript", "TypeScript", "Python", "Figma", "Premiere", "Vue", "React", "Electron", "Express", "Next.js", "Nest.js", "Framer Motion", "shadcn/ui", "Tailwind CSS", "Vite", "Webpack", "MySQL", "MongoDB", "Redis", "Docker", "Team communication", "Collaboration"]
  for (const { profile } of [zh, en]) {
    assert.equal(profile.skills.length, 8)
    const tags = profile.skills.flatMap(group => group.items)
    for (const skill of requested) assert.ok(tags.includes(skill), `Missing ${skill}`)
    for (const group of profile.skills) {
      assert.ok(group.title)
      assert.ok(Array.isArray(group.items) && group.items.length > 0)
      assert.equal(new Set(group.items).size, group.items.length)
    }
    for (const skill of ["FastAPI", "LangGraph", "Spline", "Supabase"]) assert.ok(tags.includes(skill))
    for (const unconfirmed of ["Blender", "After Effects", "Django", "Ar.js"]) assert.ok(!tags.includes(unconfirmed))
  }
})
