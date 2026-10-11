export type CursorMode = "default" | "block" | "a" | "text"
export type CursorBounds = { left: number; top: number; width: number; height: number }

export const cursorSpring = { damping: 20, stiffness: 300, mass: 0.5 }

// 计算吸附姿态
export function cursorGeometry(mode: CursorMode, x: number, y: number, rect: CursorBounds, lineHeight = 24) {
  const factor = Math.min(1, 100 / Math.max(rect.width, rect.height))
  const dx = x - rect.left - rect.width / 2
  const dy = y - (mode === "a" ? rect.top + rect.height + 2 : rect.top + rect.height / 2)
  if (mode === "block" || mode === "a") {
    const width = mode === "block" ? rect.width * (1 + 0.12 * factor) : rect.width
    const height = mode === "block" ? rect.height * 1.1 : 3
    return {
      x: rect.left + rect.width / 2 - width / 2 + dx * 0.1,
      y: (mode === "block" ? rect.top + rect.height / 2 : rect.top + rect.height + 2) - height / 2 + dy * 0.1,
      width, height, radius: mode === "block" ? Math.round(0.16 * Math.min(rect.width, rect.height)) : 2,
      shiftX: dx * 0.05 * factor, shiftY: dy * 0.05 * factor, scale: 1 + 0.02 * factor,
    }
  }
  const width = mode === "text" ? 4 : 20
  const height = mode === "text" ? lineHeight : 20
  return { x: x - width / 2, y: y - height / 2, width, height, radius: 20, shiftX: 0, shiftY: 0, scale: 1 }
}
