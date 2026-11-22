import test from "node:test"
import assert from "node:assert/strict"
import * as zh from "../lib/resume.ts"
import * as en from "../lib/resume-en.ts"
import { experienceSources, skillSources } from "../lib/resume-skills.ts"

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

test("both resumes share exactly the six requested skill categories", () => {
  for (const { profile } of [zh, en]) {
    assert.deepEqual(profile.skills.map(group => group.title), ["前端", "后端", "UI", "产品经理", "市场营销", "运营"])
    assert.equal(new Set(profile.skills.map(group => group.id)).size, 6)
    for (const group of profile.skills) {
      assert.ok(group.titleEn)
      assert.ok(group.items.length >= 4)
    }
  }
  assert.deepEqual(zh.profile.skills, en.profile.skills)
})

test("every term has concrete bilingual experience and a distinct official-feature source", () => {
  const skills = zh.profile.skills.flatMap(group => group.items)
  assert.equal(new Set(skills.map(skill => skill.id)).size, skills.length)
  assert.deepEqual(new Set(skills.map(skill => skill.project)), new Set(["AICoin", "Pacagen", "We0", "Motion Atlas", "Frontend", "Backend"]))
  for (const skill of skills) {
    assert.ok(skill.term && skill.meaning.zh && skill.meaning.en)
    assert.ok(skill.experience.zh && skill.experience.en, skill.id)
    assert.ok(experienceSources[skill.basis], skill.id)
    if (skill.note) {
      assert.ok(["backend", "ui"].includes(skill.basis) || ["react-typescript", "vue2", "vue3", "vite", "webpack"].includes(skill.id))
      assert.ok(skill.note.zh && skill.note.en)
      assert.equal(skill.source, undefined)
      assert.equal(skill.preview, undefined)
      continue
    }
    if (!["content-automation", "aigc", "geo", "support-operations"].includes(skill.id)) assert.ok(skill.experience.zh.length > 30 && skill.experience.en.length > 40, skill.id)
    if (!skill.source) {
      assert.ok(["growth-analytics", "ab-testing", "event-tracking", "funnel-analysis", "ai-product-design", "prompt-engineering", "ai-feedback-loop", "evaluation", "content-automation", "aigc"].includes(skill.id))
      assert.equal(skill.preview, undefined)
      continue
    }
    const source = skillSources[skill.source]
    assert.ok(source, skill.id)
    assert.equal(source.checkedOn, ["currency", "pricing"].includes(skill.source) ? "2026-11-22" : "2026-11-21")
    assert.ok(source.observation.zh && source.observation.en)
    assert.ok(source.title.zh && source.title.en)
    if (source.scope === "local-work") assert.equal(source.url, "/spline/3d-calculator/")
    else assert.ok(["www.aicoin.com", "pacagen.com", "we0.ai"].includes(new URL(source.url).hostname))
  }
  for (const term of ["Vue 2", "Vue 3", "Vite", "Webpack", "Financial UI Engineering", "Real-time News Feed", "ECharts / AI Visualization", "SSG / Markdown", "Growth Analytics", "实验分析", "Agent Workflow Design", "GEO / AI Search Visibility", "CMS / Content Workflow"]) {
    assert.ok(skills.some(skill => skill.term === term), term)
  }
})
