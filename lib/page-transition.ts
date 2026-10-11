export type PageTransitionPhase = "idle" | "covering" | "covered" | "revealing"
export const pageTransitionPlaybackRate = 1.8

// 限定页面转场
export function isPortfolioTransition(from: string, to: string) {
  const normalize = (path: string) => path.replace(/\/$/, "") || "/"
  const pages = ["/", "/resume", "/en", "/en/resume"]
  const source = normalize(from)
  const target = normalize(to)
  return source !== target && pages.includes(source) && pages.includes(target)
}

// 推进遮罩阶段
export function nextPageTransition(phase: PageTransitionPhase, event: "start" | "covered" | "navigated" | "revealed"): PageTransitionPhase {
  if (phase === "idle" && event === "start") return "covering"
  if (phase === "covering" && event === "covered") return "covered"
  if (phase === "covered" && event === "navigated") return "revealing"
  if (phase === "revealing" && event === "revealed") return "idle"
  return phase
}
