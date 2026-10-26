import { BilibiliRankingView } from "@/components/bilibili-ranking"

export const metadata = { title: "同时在看 — Minf", description: "Bilibili 视频当前同时在看人数排行。" }

export default function Page() {
  return <BilibiliRankingView />
}
