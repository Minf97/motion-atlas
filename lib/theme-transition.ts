// 计算遮罩边界
export function themeCircle(x: number, y: number, width: number, height: number) {
  const radius = Math.hypot(Math.max(x, width - x), Math.max(y, height - y))
  return [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`]
}
