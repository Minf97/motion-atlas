import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { effectDescriptions } from "@/lib/effects-en"
import { effects, type Effect } from "@/lib/effects"
import { LoadingDemo } from "@/components/loading-demo"
import { ScrollDemo } from "@/components/scroll-demo"
import { SmoothDemo } from "@/components/smooth-demo"

// 共用案例外壳
export function EffectView({ effect, english = false }: { effect: Effect; english?: boolean }) {
  const { slug } = effect
  const index = effects.findIndex((item) => item.slug === slug)
  const next = effects[(index + 1) % effects.length]

  return <main className="detail-shell portfolio-detail" id="smooth-top" lang={english ? "en" : "zh-CN"}>
    <SiteHeader english={english} path={`/effects/${slug}`} />
    <div className="detail-intro"><div><span className="section-eyebrow">{effect.group} / {effect.number}</span><h1>{english ? effect.title : effect.subtitle}</h1><p>{english ? effectDescriptions[index] : effect.description}</p></div><span className="detail-counter">{effect.number} <i>/</i> 14</span></div>
    <div className="detail-demo">{effect.category === "loading" ? <LoadingDemo slug={slug} english={english} /> : effect.category === "smooth" ? <SmoothDemo english={english} /> : <ScrollDemo slug={slug} />}</div>
    
  </main>
}
