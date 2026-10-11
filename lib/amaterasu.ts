export const amaterasuFrameCount = 90
export const amaterasuFrameDuration = 30
export const amaterasuCoverFrame = 45

// 标记当前页面
export function amaterasuPageName(page: number) {
  if (page !== 0 && page !== 1) throw new Error(`Invalid Amaterasu page: ${page}`)
  return page === 0 ? "Vision" : "Aleph"
}

// 定位遮罩画帧
export function amaterasuFrame(elapsed: number) {
  return Math.min(amaterasuFrameCount - 1, Math.max(0, Math.floor(elapsed / amaterasuFrameDuration)))
}

// 读取原站帧图
export function amaterasuFrameUrl(frame: number) {
  if (!Number.isInteger(frame) || frame < 0 || frame >= amaterasuFrameCount) throw new Error(`Invalid Amaterasu frame: ${frame}`)
  return `https://amaterasu.ai/img/transition/transition-${frame}.webp`
}
