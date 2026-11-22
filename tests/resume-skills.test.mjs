import test, { afterEach } from "node:test"
import assert from "node:assert/strict"
import { JSDOM } from "jsdom"
import { tsImport } from "tsx/esm/api"
import { readFileSync } from "node:fs"
import { resumeSkillGroups, skillSources, skillPreviews } from "../lib/resume-skills.ts"
import { previewNotes } from "../lib/resume-preview-notes.ts"

const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "http://localhost", pretendToBeVisual: true })
dom.window.matchMedia = query => ({ media: query, matches: true, addEventListener() {}, removeEventListener() {} })
for (const key of ["window", "document", "HTMLElement", "Element", "Node", "NodeFilter", "MutationObserver", "CustomEvent", "Event", "MouseEvent", "KeyboardEvent", "FocusEvent", "HTMLInputElement"]) {
  Object.defineProperty(globalThis, key, { value: dom.window[key], configurable: true })
}
globalThis.getComputedStyle = dom.window.getComputedStyle.bind(dom.window)
globalThis.self = dom.window
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window)
globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window)
// 测试环境没有布局
globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true
const { createElement, act } = await import("react")
const { createRoot } = await import("react-dom/client")
const { ResumeSkills } = await tsImport("../components/resume-skills.tsx", import.meta.url)
let root

afterEach(async () => {
  await act(async () => root?.unmount())
  document.body.innerHTML = ""
})

async function render(english = false) {
  const host = document.createElement("main")
  document.body.append(host)
  root = createRoot(host)
  await act(async () => root.render(createElement(ResumeSkills, { groups: resumeSkillGroups, english })))
}

async function dispatch(target, name, properties = {}) {
  const event = new dom.window.Event(name, { bubbles: true, cancelable: true })
  for (const [key, value] of Object.entries(properties)) Object.defineProperty(event, key, { value })
  await act(async () => target.dispatchEvent(event))
}

test("renders exactly six localized categories and all 69 interactive terms", async () => {
  await render()
  assert.deepEqual([...document.querySelectorAll("h3")].map(el => el.textContent), ["前端", "后端", "UI", "产品经理", "市场营销", "运营"])
  assert.equal(document.querySelectorAll(".resume-skill-trigger").length, 69)
  assert.equal(document.querySelector("[role=dialog]"), null)
})

test("mouse hover reveals real project experience and its product location", async () => {
  await render()
  const trigger = [...document.querySelectorAll("button")].find(el => el.textContent === "Canvas Rendering")
  await dispatch(trigger, "pointerover", { pointerType: "mouse" })
  assert.equal(document.querySelector("[role=dialog]"), null, "hover does not open immediately")
  await act(async () => new Promise(resolve => setTimeout(resolve, 120)))
  assert.equal(document.querySelector("[role=dialog]"), null, "brief pointer passes stay quiet")
  await act(async () => new Promise(resolve => setTimeout(resolve, 180)))
  const card = document.querySelector("[role=dialog]")
  const skill = resumeSkillGroups[0].items.find(item => item.id === "canvas")
  assert.ok(card)
  assert.ok(card.textContent.includes(skill.experience.zh))
  assert.ok(card.textContent.includes("AICoin"))
  assert.equal(card.querySelector("a").href, skillSources[skill.source].url)
  assert.equal(card.querySelector("a").target, "_blank")
  assert.equal(trigger.getAttribute("aria-expanded"), "true")
  assert.ok(card.querySelector("img").src.endsWith(skillPreviews[skill.preview].image))
  assert.ok(card.textContent.includes(previewNotes[skill.preview].detail.zh))
  assert.deepEqual([...card.querySelectorAll(".resume-preview-details strong")].map(el => el.textContent), ["双 Canvas 与渲染帧数调优", "KlineChart 日常维护"])
  assert.ok(card.textContent.includes('redraw("OverlayCanvas", false)'))
  assert.ok(card.textContent.includes("只重画覆盖层"))
  assert.equal(card.querySelector(".resume-preview-details").start, 2)
  await act(async () => trigger.click())
  assert.ok(document.querySelector("[role=dialog]"), "click after hover keeps the experience visible")
  await dispatch(trigger, "pointerout", { pointerType: "mouse", relatedTarget: document.body })
  await dispatch(card, "pointerover", { pointerType: "mouse", relatedTarget: document.body })
  await act(async () => new Promise(resolve => setTimeout(resolve, 220)))
  assert.ok(document.querySelector("[role=dialog]"), "card stays open when pointer crosses to its links")
  await dispatch(card, "pointerout", { pointerType: "mouse", relatedTarget: document.body })
  await act(async () => new Promise(resolve => setTimeout(resolve, 220)))
  assert.equal(document.querySelector("[role=dialog]"), null)
})

test("touch activation, close button and English local-work links work", async () => {
  await render(true)
  const trigger = [...document.querySelectorAll("button")].find(el => el.textContent === "Spline")
  await dispatch(trigger, "pointerover", { pointerType: "touch" })
  assert.equal(document.querySelector("[role=dialog]"), null)
  await act(async () => trigger.click())
  const card = document.querySelector("[role=dialog]")
  assert.equal(card.lang, "en")
  assert.ok(card.textContent.includes("created and embedded the Spline works"))
  assert.equal(card.querySelector("a").getAttribute("href").replace(/\/$/, ""), "/en/spline/3d-calculator")
  assert.ok(card.querySelector("img").alt.includes("3D Calculator"))
  const zoom = card.querySelector("button[aria-label='Zoom product preview']")
  assert.equal(zoom.getAttribute("aria-pressed"), "false")
  await act(async () => zoom.click())
  assert.equal(zoom.getAttribute("aria-pressed"), "true")
  assert.equal(zoom.dataset.zoomed, "true")
  await dispatch(card, "pointerout", { pointerType: "touch", relatedTarget: document.body })
  await act(async () => new Promise(resolve => setTimeout(resolve, 220)))
  assert.ok(document.querySelector("[role=dialog]"), "touch interactions keep the preview open")
  await act(async () => card.querySelector("button[aria-label='Close experience']").click())
  assert.equal(document.querySelector("[role=dialog]"), null)
  assert.deepEqual([...document.querySelectorAll("h3")].map(el => el.textContent), resumeSkillGroups.map(group => group.titleEn))
})

test("keyboard focus opens experience and Escape dismisses it", async () => {
  await render()
  const trigger = [...document.querySelectorAll("button")].find(el => el.textContent === "Canvas Rendering")
  await act(async () => trigger.focus())
  assert.ok(document.querySelector("[role=dialog]"))
  assert.equal(document.activeElement, trigger, "hover/focus never steals focus")
  await act(async () => trigger.click())
  assert.ok(document.querySelector("[role=dialog]"), "activation after focus does not immediately close the card")
  await dispatch(trigger, "keydown", { key: "Escape" })
  assert.equal(document.querySelector("[role=dialog]"), null)
})

test("leaving a tag before the delay cancels its pending preview", async () => {
  await render()
  const trigger = [...document.querySelectorAll("button")].find(el => el.textContent === "Canvas Rendering")
  await dispatch(trigger, "pointerover", { pointerType: "mouse" })
  await dispatch(trigger, "pointerout", { pointerType: "mouse", relatedTarget: document.body })
  await act(async () => new Promise(resolve => setTimeout(resolve, 300)))
  assert.equal(document.querySelector("[role=dialog]"), null)
})

test("all previews including gallery images have local screenshots and bilingual annotations", () => {
  for (const key of Object.keys(skillPreviews)) {
    const preview = skillPreviews[key]
    const note = previewNotes[key]
    const id = key
    assert.ok(preview.label.zh && preview.label.en, id)
    assert.ok(note.detail.zh && note.detail.en, id)
    assert.ok(note.width > 0 && note.height > 0)
    assert.ok(note.x > 0 && note.x < 100 && note.y > 0 && note.y < 100)
    const image = readFileSync(new URL(`../public${preview.image}`, import.meta.url))
    assert.equal(image.subarray(0, 4).toString(), "RIFF")
    assert.equal(image.subarray(8, 12).toString(), "WEBP")
    assert.ok(image.length > 1000)
  }
})

test("new AICoin cases expose the requested implementation details in both languages", async () => {
  const cases = [
    { term: "Redis", key: "agents", sections: 4, zh: ["XADD", "XREAD", "XRANGE", "SSE", "EventSource", "last_stream_id", "ChatParser", "数据库"], en: ["XADD", "XREAD", "XRANGE", "SSE", "EventSource", "last_stream_id", "ChatParser", "database"] },
    { term: "Financial UI Engineering", key: "currency", sections: 4, zh: ["独立负责", "最复杂", "金融组件", "货币符号", "1550px+", "1280px+", "780px+", "480px+", "CSS Grid", "中间主区域", "WebSocket", "分页", "虚拟列表"], en: ["Independently owned", "most complex", "financial component", "currency symbols", "1550px+", "1280px+", "780px+", "480px+", "CSS Grid", "scroll chaining", "WebSocket", "pagination", "virtualized"] },
    { term: "Real-time News Feed", key: "news", sections: 3, zh: ["20–30", "WebSocket", "分页"], en: ["20–30", "WebSocket", "pagination"] },
    { term: "ECharts / AI Visualization", key: "hotspots", sections: 4, zh: ["余弦", "Redis", "词云", "PWA", "Loading", "滚动边界"], en: ["cosine", "Redis", "word-cloud", "PWA", "loading", "overflow"] },
    { term: "SSG / Markdown", key: "aiscript", sections: 2, zh: ["Next.js 8", "SSG", "Markdown", "特殊格式"], en: ["Next.js 8", "SSG", "Markdown", "special legacy formats"] },
  ]
  for (const english of [false, true]) {
    await render(english)
    for (const entry of cases) {
      await act(async () => [...document.querySelectorAll("button")].find(el => el.textContent === entry.term).click())
      const card = document.querySelector("[role=dialog]")
      assert.equal(card.querySelectorAll(".resume-preview-details li").length, entry.sections)
      for (const text of english ? entry.en : entry.zh) assert.ok(card.textContent.includes(text), `${entry.term}: ${text}`)
      assert.equal(card.querySelector("img").getAttribute("src"), skillPreviews[entry.key].image)
      if (entry.key !== "hotspots") assert.equal(card.querySelector("a").getAttribute("href"), skillSources[entry.key].url)
      await act(async () => card.querySelector(".resume-skill-card-top button").click())
    }
    await act(async () => root.unmount())
    root = undefined
    document.body.innerHTML = ""
  }
})

test("Electron shows technical details and switches its gallery in both languages", async t => {
  const previous = process.env.NEXT_PUBLIC_BASE_PATH
  t.after(() => {
    if (previous === undefined) delete process.env.NEXT_PUBLIC_BASE_PATH
    else process.env.NEXT_PUBLIC_BASE_PATH = previous
  })
  process.env.NEXT_PUBLIC_BASE_PATH = "/motion-atlas"
  for (const english of [false, true]) {
    await render(english)
    await act(async () => [...document.querySelectorAll("button")].find(el => el.textContent === "Electron").click())
    const card = document.querySelector("[role=dialog]")
    const tabs = [...card.querySelectorAll(".resume-preview-gallery button")]
    assert.equal(tabs.length, 4)
    assert.equal(card.querySelectorAll(".resume-preview-details li").length, 4)
    const expected = english
      ? ["cosine similarity", "Redis", "ECharts", "word-cloud", "triangular", "PWA", "loading", "overflow"]
      : ["余弦相似度", "Redis", "ECharts", "词云", "三角形", "PWA", "Loading", "滚动边界"]
    for (const text of expected) assert.ok(card.textContent.includes(text), `Electron: ${text}`)
    assert.equal(tabs[0].getAttribute("aria-pressed"), "true")
    for (const [index, key] of [[1, "hotspots"], [2, "desktop-news"], [3, "desktop-chart"], [0, "desktop"]]) {
      await act(async () => card.querySelector(".resume-preview-viewport").click())
      await act(async () => tabs[index].click())
      assert.equal(card.querySelector(".resume-preview-viewport").getAttribute("aria-pressed"), "false")
      assert.equal(card.querySelector(".resume-preview-shot img").getAttribute("src"), `/motion-atlas${skillPreviews[key].image}`)
      assert.equal(card.querySelector("figcaption strong").textContent, skillPreviews[key].label[english ? "en" : "zh"])
      assert.equal(tabs.filter(button => button.getAttribute("aria-pressed") === "true").length, 1)
      assert.equal(tabs[index].getAttribute("aria-pressed"), "true")
    }
    await act(async () => root.unmount())
    root = undefined
    document.body.innerHTML = ""
  }
})

test("preview assets retain the GitHub Pages deployment prefix", async t => {
  const previous = process.env.NEXT_PUBLIC_BASE_PATH
  t.after(() => {
    if (previous === undefined) delete process.env.NEXT_PUBLIC_BASE_PATH
    else process.env.NEXT_PUBLIC_BASE_PATH = previous
  })
  process.env.NEXT_PUBLIC_BASE_PATH = "/motion-atlas"
  await render()
  await act(async () => [...document.querySelectorAll("button")].find(el => el.textContent === "Canvas Rendering").click())
  assert.equal(document.querySelector("[role=dialog] img").getAttribute("src"), "/motion-atlas/images/skill-previews/chart.webp")
})

test("React uses the existing cursor caption in both languages without a product popover", async () => {
  for (const english of [false, true]) {
    await render(english)
    const trigger = [...document.querySelectorAll("button")].find(el => el.textContent === "React / TypeScript")
    const caption = english ? "I did confused by Vue or React, when I was using Vue" : "我曾经确实困扰过，到底要不要学 React，因为实在不如 Vue 好用"
    assert.equal(trigger.dataset.voice, caption)
    assert.equal(trigger.dataset.cursor, "block")
    assert.equal(document.getElementById(trigger.getAttribute("aria-describedby")).textContent, caption)
    await dispatch(trigger, "pointerover", { pointerType: "mouse" })
    await act(async () => new Promise(resolve => setTimeout(resolve, 300)))
    await act(async () => trigger.click())
    assert.equal(document.querySelector("[role=dialog]"), null)
    assert.equal(trigger.hasAttribute("aria-haspopup"), false)
    await act(async () => root.unmount())
    root = undefined
    document.body.innerHTML = ""
  }
})

test("new frontend and UI terms use the supplied dialog with distinct explanations", async () => {
  for (const english of [false, true]) {
    await render(english)
    for (const [term, expected] of [["Surface Elevation", english ? "progressively lighter" : "背景最暗"], ["Data-driven Rendering", english ? "array of objects" : "数组对象"]]) {
      await act(async () => [...document.querySelectorAll("button")].find(el => el.textContent === term).click())
      const card = document.querySelector("[role=dialog]")
      assert.ok(card.textContent.includes(expected), term)
      assert.ok(card.querySelector("img").src.endsWith("/aicoin-download.webp"))
      assert.ok(card.textContent.includes(english ? "User-supplied AICoin capture" : "用户提供的 AICoin 截图"))
      await act(async () => card.querySelector(".resume-skill-card-top button").click())
    }
    await act(async () => root.unmount())
    root = undefined
    document.body.innerHTML = ""
  }
})


test("frontend stack tags show personal captions in both languages without product popovers", async () => {
  const captions = [
    ["Vue 2", "Vue2 是我最早学的技术栈", "Vue 2 was the first tech stack I learned."],
    ["Vue 3", "比 React 更优秀更简单的框架，极大地降低使用者的心智负担", "To me, Vue 3 is better and simpler than React, with much less mental overhead."],
    ["Vite", "学过三元同学的 Vite 底层原理课，不过已经通通忘光了", "I took Sanyuan's course on Vite internals, but I've forgotten it all by now."],
    ["Webpack", "发现工作里比 Vite 的使用场景多多了", "I've found far more uses for Webpack than Vite at work."],
  ]
  for (const english of [false, true]) {
    await render(english)
    for (const [term, zh, en] of captions) {
      const tag = [...document.querySelectorAll("button")].find(el => el.textContent === term)
      const caption = english ? en : zh
      assert.equal(tag.dataset.voice, caption)
      assert.equal(document.getElementById(tag.getAttribute("aria-describedby")).textContent, caption)
      await act(async () => tag.click())
      assert.equal(document.querySelector("[role=dialog]"), null)
    }
    await act(async () => root.unmount())
    root = undefined
    document.body.innerHTML = ""
  }
})


test("internal and pricing skills show bilingual text without substitute screenshots", async () => {
  for (const english of [false, true]) {
    await render(english)
    for (const term of ["Growth Analytics", "数据分析", "漏斗分析", "实验分析", "AI Product Design", "Prompt Engineering", "AI Feedback Loop", "Evaluation", "商业化策略", "定价策略", "收费体系", "AI Content Automation", "AIGC", "GEO / AI Search Visibility"]) {
      await act(async () => [...document.querySelectorAll("button")].find(el => el.textContent === term).click())
      const card = document.querySelector("[role=dialog]")
      assert.ok(card.querySelector(".resume-skill-experience").textContent)
      assert.equal(card.querySelector("img"), null, term)
      assert.equal(card.querySelector("iframe"), null, term)
      assert.equal(card.textContent.includes("us.posthog.com"), false)
      if (["商业化策略", "定价策略", "收费体系"].includes(term)) assert.equal(card.querySelector("a").href, "https://we0.ai/zh/pricing")
      await act(async () => card.querySelector(".resume-skill-card-top button").click())
    }
    await act(async () => root.unmount())
    root = undefined
    document.body.innerHTML = ""
  }
})
