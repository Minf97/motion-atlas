import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { effects, getEffect } from "@/lib/effects"
import { LoadingDemo } from "@/components/loading-demo"
import { ScrollDemo } from "@/components/scroll-demo"
import { SmoothDemo } from "@/components/smooth-demo"

export function generateStaticParams() {
  return effects.map(({ slug }) => ({ slug }))
}

export default async function EffectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const effect = getEffect(slug)
  if (!effect) notFound()
  const index = effects.findIndex((item) => item.slug === slug)
  const next = effects[(index + 1) % effects.length]

  return <main className="detail-shell portfolio-detail" id="smooth-top">
    <header className="portfolio-header"><Link href="/" className="portfolio-name">胥昱全<span> / Frontend Engineer</span></Link><nav aria-label="主导航"><Link href="/"><ArrowLeft aria-hidden="true" /> 全部作品</Link><Link href="/resume">简历 <ArrowRight aria-hidden="true" /></Link></nav></header>
    <div className="detail-intro"><div><span className="section-eyebrow">{effect.group} / {effect.number}</span><h1>{effect.subtitle}</h1><p>{effect.description}</p></div><span className="detail-counter">{effect.number} <i>/</i> 14</span></div>
    <div className="detail-demo">{effect.category === "loading" ? <LoadingDemo slug={slug} /> : effect.category === "smooth" ? <SmoothDemo /> : <ScrollDemo slug={slug} />}</div>
    <div className="detail-note"><span>体验方式</span><p>{effect.category === "scrolling" ? "向下滚动，再反向滚动，观察动作如何跟随页面位置变化。" : effect.category === "smooth" ? "切换 Lenis 和 Native 模式，点击锚点比较两种滚动手感。" : "点击演示中的按钮，观察完整的转场过程。"}</p></div>
    <Link className="next-effect" href={`/effects/${next.slug}`}><span>下一个案例 / {next.number}</span><strong>{next.subtitle}</strong><ArrowRight aria-hidden="true" /></Link>
  </main>
}
