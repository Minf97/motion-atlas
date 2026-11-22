import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

test("resume removes explanatory prompts while retaining product previews", () => {
  const skills = readFileSync(new URL("../components/resume-skills.tsx", import.meta.url), "utf8")
  const preview = readFileSync(new URL("../components/resume-skill-preview.tsx", import.meta.url), "utf8")
  for (const text of ["悬停或点击标签", "经历来自简历", "Hover, focus or tap", "Experience is drawn from", "resume-skills-hint", "resume-skills-note"]) {
    assert.ok(!skills.includes(text), text)
  }
  for (const text of ["对应产品位置", "In the product"]) assert.ok(!preview.includes(text), text)
  assert.ok(preview.includes("查看原页"))
  assert.ok(preview.includes("resume-preview-viewport"))
})

test("public navigation hides Agent while preserving resume and language links", () => {
  const header = readFileSync(new URL("../components/site-header.tsx", import.meta.url), "utf8")
  assert.ok(!header.includes("/agent"))
  assert.ok(header.includes("/resume"))
  assert.ok(header.includes("hrefLang"))
})
