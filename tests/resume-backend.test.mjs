import test from "node:test"
import assert from "node:assert/strict"
import { backendStack, redisSkill } from "../lib/resume-skills-backend.ts"
import { technicalSkills } from "../lib/resume-skills-technical.ts"

test("backend includes all 23 requested terms alongside the existing project skills", () => {
  const group = technicalSkills.find(item => item.id === "backend")
  const expected = ["Hono", "nginx", "Python", "Cloudflare Workers", "Redis", "Django", "Nest.js", "MySQL", "MongoDB", "Prisma", "Drizzle", "GraphQL", "OAuth 2.0", "JWT", "Webhook", "K8S", "服务器操作", "Docker", "AWS", "CI/CD", "COS", "OSS", "E2B Sandbox"]
  assert.deepEqual(group.items.slice(0, 23).map(item => item.term), expected)
  assert.equal(group.items.length, 28)
  assert.equal(new Set(group.items.map(item => item.id)).size, 28)
})

test("backend captions preserve the supplied personal notes without invented projects", () => {
  const notes = new Map(backendStack.map(item => [item.term, item.note.zh]))
  assert.equal(notes.get("Python"), "人生苦短，我用 Python")
  for (const [term, words] of [
    ["Hono", ["最轻量", "最简单"]], ["nginx", ["负载均衡", "middleware"]],
    ["Cloudflare Workers", ["独立开发者"]], ["Django", ["大三", "图书管理"]],
    ["Nest.js", ["掘金", "Java", "Next.js"]], ["Prisma", ["不再用了"]],
    ["COS", ["腾讯云"]], ["OSS", ["阿里云"]], ["Drizzle", ["Drizzle Studio"]], ["GraphQL", ["RESTful"]],
    ["OAuth 2.0", ["授权协议", "踩过"]], ["Webhook", ["飞书", "第三方"]],
    ["服务器操作", ["SSH", "SFTP", "DNS", "PM2"]], ["AWS", ["EC2", "数据分析中台"]],
  ]) for (const word of words) assert.ok(notes.get(term).includes(word), `${term}: ${word}`)
  for (const skill of backendStack) {
    assert.equal(skill.basis, "backend")
    assert.equal(skill.project, "Backend")
    assert.ok(skill.note.zh && skill.note.en)
    assert.equal(skill.source, undefined)
    assert.equal(skill.preview, undefined)
  }
})

test("Redis explains audited event delivery, reconnect recovery and persistent history", () => {
  assert.equal(redisSkill.note, undefined)
  assert.equal(redisSkill.project, "We0")
  assert.equal(redisSkill.details.length, 4)
  for (const locale of ["zh", "en"]) {
    const text = redisSkill.details.map(item => item.detail[locale]).join(" ")
    for (const term of ["session_id", "XADD", "XREAD", "XRANGE", "SSE", "EventSource", "lastEventId", "last_stream_id", "ChatParser"]) {
      assert.ok(text.includes(term), `${locale}: ${term}`)
    }
  }
})
