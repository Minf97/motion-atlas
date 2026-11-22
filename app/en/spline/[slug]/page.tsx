import { notFound } from "next/navigation"
import { SplineView } from "@/components/spline-view"
import { splineWorks } from "@/lib/spline-works"
import "../../../spline/spline.css"

export { generateStaticParams, generateMetadata } from "../../../spline/[slug]/page"

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!splineWorks.some(work => work.id === slug)) notFound()
  return <SplineView key={slug} workId={slug} english />
}
