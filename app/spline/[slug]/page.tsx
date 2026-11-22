import { notFound } from "next/navigation"
import { SplineView } from "@/components/spline-view"
import { splineWorks } from "@/lib/spline-works"
import "../spline.css"

// 静态生成作品页
export function generateStaticParams() { return splineWorks.map(work => ({ slug: work.id })) }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const work = splineWorks.find(item => item.id === slug)
  if (!work) notFound()
  return { title: `${work.title} — Minf`, description: `Minf · ${work.title} · Spline` }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!splineWorks.some(work => work.id === slug)) notFound()
  return <SplineView key={slug} workId={slug} />
}
