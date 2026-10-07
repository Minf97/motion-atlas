// 计算滚动进度
export function scrollProgress(top: number, height: number, viewportHeight: number) {
  const distance = height - viewportHeight
  if (distance <= 0) return 0
  return Math.min(1, Math.max(0, -top / distance))
}

// 映射视频时间
export function videoTime(progress: number, duration: number) {
  return Math.min(duration, Math.max(0, progress * duration))
}
