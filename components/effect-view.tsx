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
    <div className="detail-note"><span>{english ? "Try it" : "体验方式"}</span><p>{english ? (effect.category === "scrolling" ? "Scroll down and back up to see how motion follows the page position." : effect.category === "smooth" ? "Switch between Lenis and Native, then try the anchor links to compare the scrolling behavior." : "Use the demo buttons to watch the full transition.") : effect.category === "scrolling" ? "向下滚动，再反向滚动，观察动作如何跟随页面位置变化。" : effect.category === "smooth" ? "切换 Lenis 和 Native 模式，点击锚点比较两种滚动手感。" : "点击演示中的按钮，观察完整的转场过程。"}</p></div>
    <Link className="next-effect" href={`${english ? "/en" : ""}/effects/${next.slug}`}><span>{english ? "Next study" : "下一个案例"} / {next.number}</span><strong>{english ? next.title : next.subtitle}</strong><ArrowRight aria-hidden="true" /></Link>
  </main>
}
