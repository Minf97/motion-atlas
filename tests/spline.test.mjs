import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { splineWorks } from "../lib/spline-works.ts"

const source = path => readFileSync(new URL(path, import.meta.url), "utf8")

test("Spline catalogue embeds Minf's published scene with unique work IDs", () => {
  assert.equal(splineWorks[0].scene, "https://prod.spline.design/SJxTTiPROVMsmkFZ/scene.splinecode")
  assert.equal(splineWorks[0].title, "3D Keyboard")
  assert.equal(splineWorks[0].titleEn, "3D Keyboard")
  assert.doesNotMatch(JSON.stringify(splineWorks), /习作|study/i)
  assert.equal(new Set(splineWorks.map(work => work.id)).size, splineWorks.length)
  for (const work of splineWorks) {
    assert.ok(work.title && work.titleEn && work.number)
    assert.equal(new URL(work.scene).protocol, "https:")
  }
})

test("Chinese and English pages share the Spline viewer", () => {
  assert.match(source("../app/spline/page.tsx"), /<SplineView \/>/)
  assert.match(source("../app/en/spline/page.tsx"), /<SplineView english \/>/)
  const viewer = source("../components/spline-view.tsx")
  assert.match(viewer, /path="\/spline"/)
  assert.match(viewer, /scene=\{work.scene\}/)
  assert.match(viewer, /ssr: false/)
  assert.match(viewer, /onLoad=\{\(\) => setLoaded\(true\)\}/)
  assert.match(viewer, /role="alert"/)
  assert.match(viewer, /setRevision\(value => value \+ 1\)/)
})

test("Spline is discoverable from navigation and the collection", () => {
  assert.match(source("../components/site-header.tsx"), /\/spline`\}>Spline/)
  const portfolio = source("../components/portfolio-view.tsx")
  assert.match(portfolio, /id="spline"/)
  assert.match(portfolio, /splineWorks.map/)
  assert.match(portfolio, /\/spline`\}/)
})
