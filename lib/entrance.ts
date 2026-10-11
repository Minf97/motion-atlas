export const entranceSessionKey = "minf:entrance-seen"
export const entranceDrawingDuration = 2700

// 编排签名笔顺
export const entranceStrokes = [
  { letter: "M", delay: 150, duration: 850, path: "M 18 104 C 29 99 40 76 49 48 C 53 35 56 27 58 30 C 62 35 47 88 48 99 C 49 108 72 56 87 39 C 101 22 96 44 91 61 L 80 98 C 78 108 88 100 101 86" },
  { letter: "i", delay: 1000, duration: 300, path: "M 110 70 C 106 80 100 95 104 100 C 108 105 119 95 126 85" },
  { letter: "n", delay: 1300, duration: 500, path: "M 126 85 L 120 101 C 129 82 144 66 149 71 C 154 76 139 94 144 100 C 149 106 163 94 174 82" },
  { letter: "f", delay: 1800, duration: 500, path: "M 174 82 C 190 66 208 37 202 30 C 194 21 183 48 176 77 C 169 105 165 127 157 125 C 149 123 162 103 177 94 L 215 75" },
  { letter: "i-dot", delay: 2300, duration: 100, path: "M 116 55 L 117 53" },
  { letter: "f-cross", delay: 2400, duration: 200, path: "M 163 66 C 178 65 198 61 218 62" },
] as const
export type EntrancePhase = "loading" | "ready" | "leaving" | "done"

// 推进开屏阶段
export function nextEntrancePhase(phase: EntrancePhase, event: "loaded" | "enter" | "finished"): EntrancePhase {
  if (phase === "loading" && event === "loaded") return "ready"
  if (phase === "ready" && event === "enter") return "leaving"
  if (phase === "leaving" && event === "finished") return "done"
  return phase
}
