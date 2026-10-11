import test from "node:test"
import assert from "node:assert/strict"
import { themeCircle } from "../lib/theme-transition.ts"

test("theme reveal reaches all four corners from any toggle position", () => {
  for (const [x, y] of [[0, 0], [370, 35], [195, 422], [390, 844]]) {
    const frames = themeCircle(x, y, 390, 844)
    const radius = Number(frames[1].match(/circle\(([^p]+)px/)[1])
    for (const [cx, cy] of [[0, 0], [390, 0], [0, 844], [390, 844]]) {
      assert.ok(radius >= Math.hypot(cx - x, cy - y))
    }
    assert.equal(frames[0], `circle(0px at ${x}px ${y}px)`)
  }
})
