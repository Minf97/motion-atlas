import { notFound } from "next/navigation"
import { effects, getEffect } from "@/lib/effects"
import { EffectView } from "@/components/effect-view"
export const metadata = { title: "Interaction Study — Yuquan Xu", description: "Frontend loading, transition and scroll interaction studies." }
export function generateStaticParams() { return effects.map(({ slug }) => ({ slug })) }
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const effect = getEffect(slug)
  if (!effect) notFound()
  return <EffectView effect={effect} english />
}
