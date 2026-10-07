// 计算镜头环绕
export function orbitPosition(progress: number, radius: number) {
  const position = Math.min(1, Math.max(0, progress))
  const angle = -0.65 + position * 1.5
  return [Math.sin(angle) * radius, 0.25 + position * 0.2, Math.cos(angle) * radius] as const
}
