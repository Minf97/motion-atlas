import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, Asterisk } from "lucide-react"
import { Button } from "@/components/ui/button"
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

  return <main className="detail-shell" id="smooth-top"><header className="detail-header"><Link href="/" className="brand" aria-label="返回 Motion Atlas 首页"><Asterisk aria-hidden="true" /><span>MOTION<br />ATLAS<span className="brand-dot">.</span></span></Link><span>INTERACTIVE STUDY / {effect.number}</span><Button asChild variant="outline"><Link href="/"><ArrowLeft data-icon="inline-start" /> 全部案例</Link></Button></header><div className="detail-intro"><div><span className="section-eyebrow">{effect.group.toUpperCase()} / EXPERIMENT {effect.number}</span><h1>{effect.title}<span>.</span></h1><p>{effect.description}</p></div><span className="detail-counter">{effect.number} <i>/</i> 14</span></div><div className="detail-demo">{effect.category === "loading" ? <LoadingDemo slug={slug} /> : effect.category === "smooth" ? <SmoothDemo /> : <ScrollDemo slug={slug} />}</div><div className="reference-panel"><span>REFERENCE / {effect.number}</span><div><strong>{effect.reference.name}</strong><p>{effect.reference.cue}</p></div><div className="reference-panel-links"><a href={effect.reference.url} target="_blank" rel="noopener noreferrer">查看原站 ↗</a>{effect.reference.motionUrl && <a href={effect.reference.motionUrl} target="_blank" rel="noopener noreferrer">动效记录 ↗</a>}</div></div><div className="detail-note"><span>HOW TO EXPERIENCE</span><p>{effect.category === "scrolling" ? "向下滚动，也试着反向滚动。每一步进度都由当前位置决定。" : effect.category === "smooth" ? "切换 Lenis 和 Native 模式，再点击锚点比较两种滚动手感。" : "点击演示中的按钮，观察动画的完整过程。"}</p></div><Link className="next-effect" href={`/effects/${next.slug}`}><span>NEXT EXPERIMENT / {next.number}</span><strong>{next.title}</strong><ArrowRight aria-hidden="true" /></Link></main>
}
