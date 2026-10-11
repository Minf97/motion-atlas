import test from "node:test"
import assert from "node:assert/strict"
import { cursorGeometry, cursorSpring } from "../lib/resume-cursor.ts"
import * as zh from "../lib/resume.ts"
import * as en from "../lib/resume-en.ts"

const rect = { left: 100, top: 200, width: 100, height: 30 }

test("cursor matches Lawted spring and magnetic geometry", () => {
  assert.deepEqual(cursorSpring, { damping: 20, stiffness: 300, mass: 0.5 })
  const center = cursorGeometry("block", 150, 215, rect)
  assert.ok(Math.abs(center.width - 112) < 1e-10)
  assert.equal(center.height, 33)
  assert.ok(Math.abs(center.x - 94) < 1e-10)
  assert.equal(center.y, 198.5)
  assert.equal(center.radius, 5)
  const edge = cursorGeometry("block", 190, 225, rect)
  assert.equal(edge.x - center.x, 4)
  assert.equal(edge.shiftX, 2)
  assert.equal(edge.shiftY, 0.5)
  assert.equal(edge.scale, 1.02)
})

test("links underline, text uses a caret, and default resets to a dot", () => {
  const link = cursorGeometry("a", 150, 232, rect)
  assert.equal(link.height, 3)
  assert.equal(link.width, 100)
  assert.equal(link.y, 230.5)
  assert.equal(link.shiftY, 0)
  assert.equal(cursorGeometry("a", 150, 212, rect).shiftY, -1)
  const text = cursorGeometry("text", 150, 215, rect, 28)
  assert.equal(text.width, 4)
  assert.equal(text.height, 28)
  const dot = cursorGeometry("default", 150, 215, rect)
  assert.equal(dot.width, 20)
  assert.equal(dot.scale, 1)
  assert.equal(dot.shiftX, 0)
})

test("both resumes include the requested personal information and education", () => {
  for (const resume of [zh, en]) {
    assert.deepEqual(resume.personal, { birthday: "Dec 2000", mbti: "ESTP" })
    assert.equal(resume.education.date, "Sep 2019 — July 2023")
  }
  assert.equal(zh.education.school, "广东石油化工学院")
  assert.equal(en.education.school, "Guangdong University of Petrochemical Technology")
})
