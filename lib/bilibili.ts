export type BilibiliCategory = "technology" | "life"

export type BilibiliVideo = {
  aid: string
  bvid: string
  title: string
  url: string
  cover: string
  author: string
  online: number
  online_updated_at: string
  age_seconds?: number | null
  stale?: boolean
  sample_error: string | null
  area: string
  rank: number
}

export type BilibiliRanking = {
  category: BilibiliCategory
  sampled_at: string
  candidate_count: number
  fresh_count: number
  stale_count: number
  collector: { state?: string; error?: string; updated_at?: string; cooldown_until?: string }
  videos: BilibiliVideo[]
}

// 组装分区地址
export function rankingUrl(apiBaseUrl: string | undefined, category: BilibiliCategory) {
  if (!apiBaseUrl) return null
  return `${apiBaseUrl.replace(/\/$/, "")}/bilibili/ranking?category=${category}`
}

// 生成封面代理地址
export function coverUrl(apiBaseUrl: string | undefined, imageUrl: string) {
  if (!apiBaseUrl) return null
  return `${apiBaseUrl.replace(/\/$/, "")}/bilibili/cover?url=${encodeURIComponent(imageUrl)}`
}

// 格式化在线数
export function formatOnlineCount(value: number) {
  return new Intl.NumberFormat("zh-CN").format(value)
}

// 格式化观测时间
export function formatObservationTime(value: string, english = false) {
  return new Intl.DateTimeFormat(english ? "en" : "zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date(value))
}

// 提取接口错误
export function rankingErrorMessage(status: number, detail?: string) {
  return detail || `Ranking API returned ${status}`
}
