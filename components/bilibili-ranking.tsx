"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ArrowUpRight, RefreshCw } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { coverUrl, formatObservationTime, formatOnlineCount, rankingErrorMessage, rankingUrl, type BilibiliCategory, type BilibiliRanking } from "@/lib/bilibili"

const categoryNames: Record<BilibiliCategory, string> = { technology: "科技", life: "生活" }

export function BilibiliRankingView({ english = false }: { english?: boolean }) {
  const [category, setCategory] = useState<BilibiliCategory>("technology")
  const [ranking, setRanking] = useState<BilibiliRanking | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const requestRef = useRef<AbortController | null>(null)

  const refresh = useCallback(async (selected: BilibiliCategory) => {
    requestRef.current?.abort()
    const controller = new AbortController()
    requestRef.current = controller
    const url = rankingUrl(process.env.NEXT_PUBLIC_AGENT_API_URL, selected)
    if (!url) {
      setRanking(null)
      setError(english ? "Ranking API is not configured." : "排行榜服务尚未配置，请设置 NEXT_PUBLIC_AGENT_API_URL。")
      setLoading(false)
      return
    }
    setRanking(null)
    setLoading(true)
    setError("")
    try {
      const response = await fetch(url, { cache: "no-store", signal: controller.signal })
      const payload = await response.json() as BilibiliRanking & { detail?: string }
      if (!response.ok) throw new Error(rankingErrorMessage(response.status, payload.detail))
      setRanking(payload)
    } catch (caught) {
      if (controller.signal.aborted) return
      setRanking(null)
      setError(caught instanceof Error ? caught.message : String(caught))
    } finally {
      if (!controller.signal.aborted) setLoading(false)
    }
  }, [english])

  useEffect(() => {
    void Promise.resolve().then(() => refresh(category))
    return () => requestRef.current?.abort()
  }, [category, refresh])

  const title = english ? "Live View Rank" : "同时在看"
  const selectedName = english ? (category === "technology" ? "Technology" : "Life") : categoryNames[category]
  const sampledTime = ranking?.sampled_at ? formatObservationTime(ranking.sampled_at, english) : ""
  const coolingDown = ranking?.collector.state === "cooldown"

  return <main className="bili-page" lang={english ? "en" : "zh-CN"}>
    <SiteHeader english={english} path="/bilibili" />
    <section className="bili-content" aria-labelledby="bili-title">
      <div className="bili-heading">
        <div>
          <p>{english ? "BILIBILI · REAL-TIME SNAPSHOT" : "BILIBILI · 实时在线采样"}</p>
          <h1 id="bili-title">{title}</h1>
          <span>{english ? "Videos with more people watching now, ranked by live online count." : "按当前同时在看人数排序，观察此刻哪些视频正被更多人观看。"}</span>
        </div>
        <button className="bili-refresh" type="button" onClick={() => void refresh(category)} disabled={loading}>
          <RefreshCw aria-hidden="true" className={loading ? "bili-spinning" : ""} />
          {english ? "Refresh" : "手动刷新"}
        </button>
      </div>

      <div className="bili-toolbar">
        <div className="bili-segments" role="group" aria-label={english ? "Video category" : "视频分区"}>
          {(["technology", "life"] as const).map(item => <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)}>
            {english ? (item === "technology" ? "Technology" : "Life") : categoryNames[item]}
          </button>)}
        </div>
        <p>{loading ? (english ? "Loading cached observations…" : `正在读取${selectedName}分区缓存…`) : ranking ? (english ? `${ranking.fresh_count}/${ranking.candidate_count} fresh · latest ${sampledTime}` : `${ranking.fresh_count}/${ranking.candidate_count} 条数据新鲜 · 最近观测 ${sampledTime}`) : (english ? "Waiting for data" : "等待数据")}</p>
      </div>

      {error ? <div className="bili-message" role="alert"><strong>{english ? "Could not load ranking" : "排行榜暂时无法读取"}</strong><span>{error}</span></div> : null}
      {!error && coolingDown ? <div className="bili-message" role="status"><strong>{english ? "Collector paused" : "采集暂时冷却"}</strong><span>{english ? "Bilibili returned a risk-control response. Last successful observations are kept; stale values are hidden." : "B 站返回风控响应，采集器正在冷却。保留最近一次成功观测，过期数据不会显示为实时排行。"}</span></div> : null}
      {!error && loading && !ranking ? <div className="bili-message" aria-live="polite">{english ? "Loading observations from the collector…" : `正在读取${selectedName}分区的采集结果…`}</div> : null}
      {!error && !loading && ranking?.videos.length === 0 ? <div className="bili-message">{ranking.candidate_count === 0 ? (english ? "The collector is warming up its first candidate list." : "采集器正在准备首批候选视频。") : ranking.stale_count > 0 ? (english ? "No recent observations are available yet." : "当前还没有新鲜观测，采集器正在更新数据。") : (english ? "No candidates were found for this category." : "这个分区暂时没有候选视频。")}</div> : null}

      {ranking && !error ? <>
        <div className="bili-table-head"><span>{english ? "RANK / VIDEO" : "排名 / 视频"}</span><span>{english ? "WATCHING NOW" : "同时在看"}</span></div>
        <ol className="bili-list" aria-label={english ? `${selectedName} videos by current viewers` : `${selectedName}分区同时在看排行`}>
          {ranking.videos.map(video => <li className="bili-row" key={video.aid}>
            <span className="bili-rank">{String(video.rank).padStart(2, "0")}</span>
            <a className="bili-video" href={video.url} target="_blank" rel="noreferrer">
              <Image src={coverUrl(process.env.NEXT_PUBLIC_AGENT_API_URL, video.cover)!} alt="" width={128} height={76} unoptimized />
              <span className="bili-video-copy"><strong>{video.title}</strong><small>{video.author}{video.area ? ` · ${video.area}` : ""}</small></span>
              <ArrowUpRight aria-hidden="true" />
            </a>
            <strong className="bili-count">{formatOnlineCount(video.online)}<small>{english ? "watching" : "人同时在看"}</small><time dateTime={video.online_updated_at}>{english ? "Observed " : "观测于 "}{formatObservationTime(video.online_updated_at, english)}</time></strong>
          </li>)}
        </ol>
        <p className="bili-footnote">{english ? `Candidates are discovered from Bilibili category rankings. The background collector samples sequentially; ${ranking.stale_count} stale observations are excluded.` : `候选来自 B 站分区排行榜，由后台单队列逐条采样；${ranking.stale_count} 条过期观测已排除。`}</p>
      </> : null}
    </section>
  </main>
}
