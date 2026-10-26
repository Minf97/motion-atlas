import test from "node:test"
import assert from "node:assert/strict"
import { coverUrl, formatObservationTime, formatOnlineCount, rankingErrorMessage, rankingUrl } from "../lib/bilibili.ts"

test("ranking API URL uses the configured backend and selected region", () => {
  assert.equal(rankingUrl("https://api.example.com/", "technology"), "https://api.example.com/bilibili/ranking?category=technology")
  assert.equal(rankingUrl("https://api.example.com", "life"), "https://api.example.com/bilibili/ranking?category=life")
  assert.equal(rankingUrl(undefined, "life"), null)
})

test("online counts are formatted for the ranking rows", () => {
  assert.equal(formatOnlineCount(12000), "12,000")
  assert.equal(formatOnlineCount(0), "0")
})

test("observation timestamps are formatted for the selected locale", () => {
  assert.equal(formatObservationTime("2026-10-19T08:09:10Z", true), new Intl.DateTimeFormat("en", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date("2026-10-19T08:09:10Z")))
  assert.match(formatObservationTime("2026-10-19T08:09:10Z"), /\d{2}:\d{2}:\d{2}/)
})

test("cover URLs route through the configured API without losing query characters", () => {
  assert.equal(coverUrl("https://api.example.com/", "https://i0.hdslb.com/a?x=1&y=2"), "https://api.example.com/bilibili/cover?url=https%3A%2F%2Fi0.hdslb.com%2Fa%3Fx%3D1%26y%3D2")
  assert.equal(coverUrl(undefined, "https://i0.hdslb.com/a"), null)
})

test("ranking errors preserve the backend diagnostic", () => {
  assert.equal(rankingErrorMessage(502, "Bilibili API returned -352"), "Bilibili API returned -352")
  assert.equal(rankingErrorMessage(502), "Ranking API returned 502")
})
