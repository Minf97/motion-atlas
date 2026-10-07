const stageBoundaries = [1000, 11500, 19500, 24000, 26000, 34000]
const journeyLength = 40700

// 定位原站章节
export function lawtedStage(progress: number) {
  const position = Math.min(1, Math.max(0, progress))
  return stageBoundaries.findIndex((boundary) => position < boundary / journeyLength) + 1 || 7
}

// 匹配场景事件
export function lawtedTransition(from: number, to: number) {
  if (from < 1 || from > 7 || to < 1 || to > 7 || from === to) throw new Error(`Invalid Lawted transition: ${from} → ${to}`)
  return `Stage${from}-${to}`
}

// 遵循原站事件表
export function lawtedNextStage(from: number, to: number) {
  return from > 1 && to > from + 1 ? from + 1 : to
}
