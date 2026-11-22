import test from "node:test"
import assert from "node:assert/strict"
import { businessSkills } from "../lib/resume-skills-business.ts"
import { technicalSkills } from "../lib/resume-skills-technical.ts"

test("product skills cover analytics, AI and commercialization with bilingual explanations", () => {
  const items = businessSkills.find(group => group.id === "product").items
  assert.equal(items.length, 13)
  for (const [id, words] of [
    ["event-tracking", ["PostHog", "Event Tracking", "埋点治理", "问卷", "Chat"]],
    ["funnel-analysis", ["Conversion Rate", "Drop-off Analysis", "模板", "发布"]],
    ["ab-testing", ["A/B Testing", "Experiment Design"]],
    ["growth-analytics", ["Growth Analytics"]],
    ["ai-product-design", ["AI 产品设计"]],
    ["prompt-engineering", ["提示词工程"]],
    ["ai-feedback-loop", ["Judge", "反馈"]],
    ["evaluation", ["LLM Judge", "工具选择"]],
    ["pricing-strategy", ["原价", "优惠价", "成本", "收支平衡", "价值"]],
    ["billing-model", ["早鸟价", "Custom", "订阅制"]],
  ]) {
    const skill = items.find(item => item.id === id)
    assert.ok(skill, id)
    const text = JSON.stringify(skill)
    for (const word of words) assert.ok(text.includes(word), `${id}: ${word}`)
    assert.ok(skill.experience.zh && skill.experience.en)
    assert.equal(skill.preview, undefined)
  }
  assert.equal(JSON.stringify(items).includes("us.posthog.com"), false)
})

test("marketing AI, GEO and support notes follow the latest text-only requests", () => {
  const items = businessSkills.find(group => group.id === "marketing").items
  assert.equal(items.some(item => item.id === "organic"), false)
  const get = id => items.find(item => item.id === id)
  const content = get("content-automation")
  assert.equal(content.preview, undefined)
  assert.equal(content.source, undefined)
  const aigc = get("aigc")
  assert.ok(aigc.experience.zh.includes("可灵 AI"))
  assert.ok(aigc.experience.en.includes("Kling AI"))
  for (const locale of ["zh", "en"]) {
    assert.ok(aigc.experience[locale].includes("Stable Diffusion"))
    assert.ok(aigc.experience[locale].includes("ComfyUI"))
  }
  const geo = get("geo")
  assert.equal(geo.preview, undefined)
  assert.equal(geo.details.length, 3)
  assert.ok(geo.details.some(item => item.detail.zh.includes("metadata")))
  const support = businessSkills.find(group => group.id === "operations").items.find(item => item.id === "support-operations")
  assert.equal(support.experience.zh.includes("邮件系统"), false)
  assert.equal(support.experience.zh.includes("3,700"), false)
  assert.equal(support.experience.en.includes("$3,700"), false)
})

test("UI separates Spline scenes, Framer Motion and Figma captions", () => {
  const items = technicalSkills.find(group => group.id === "ui").items
  assert.ok(items.some(item => item.term === "Spline" && item.preview === "portfolio"))
  assert.equal(items.some(item => item.term === "Motion / 3D Prototyping"), false)
  for (const [term, caption] of [["Framer Motion", "前端的丝滑过渡动效库"], ["Figma", "做设计稿的工具"]]) {
    const item = items.find(skill => skill.term === term)
    assert.equal(item.note.zh, caption)
    assert.ok(item.note.en)
  }
})
