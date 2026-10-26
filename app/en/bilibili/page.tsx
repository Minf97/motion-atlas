import { BilibiliRankingView } from "@/components/bilibili-ranking"

export const metadata = { title: "Live View Rank — Minf", description: "Bilibili videos ranked by current concurrent viewers." }

export default function Page() {
  return <BilibiliRankingView english />
}
