import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { effectDescriptions } from "@/lib/effects-en"
import { effects, getEffectNavigation, type Effect } from "@/lib/effects"
import { LoadingDemo } from "@/components/loading-demo"
import { ScrollDemo } from "@/components/scroll-demo"
import { SmoothDemo } from "@/components/smooth-demo"

// 共用案例外壳
export function EffectView({ effect, english = false }: { effect: Effect; english?: boolean }) {
  const { slug } = effect
  const index = effects.findIndex((item) => item.slug === slug)
  const { home, previous, next, prefix } = getEffectNavigation(slug, english)

  return <main className="detail-shell portfolio-detail" id="smooth-top" lang={english ? "en" : "zh-CN"}>
    <SiteHeader english={english} path={`/effects/${slug}`} />
    <nav className="effect-breadcrumb" aria-label={english ? "Back to portfolio" : "返回作品目录"}>
      <Link href={home}><ArrowLeft aria-hidden="true" />{english ? "All work" : "全部作品"}</Link>
      <Link href={`${prefix}/effects/${next.slug}/`}>{english ? "Next" : "下一个"}<ArrowRight aria-hidden="true" /></Link>
    </nav>
    <div className="detail-intro"><div><span className="section-eyebrow">{effect.group} / {effect.number}</span><h1>{english ? effect.title : effect.subtitle}</h1><p>{english ? effectDescriptions[index] : effect.description}</p></div><span className="detail-counter">{effect.number} <i>/</i> {effects.length}</span></div>
    <div className="detail-demo">{effect.category === "loading" ? <LoadingDemo slug={slug} english={english} /> : effect.category === "smooth" ? <SmoothDemo english={english} /> : <ScrollDemo slug={slug} />}</div>
    <nav className="effect-pagination" aria-label={english ? "Browse effects" : "浏览特效"}>
      <Link className="effect-adjacent" href={`${prefix}/effects/${previous.slug}/`} rel="prev">
        <span><ArrowLeft aria-hidden="true" />{english ? "Previous" : "上一个"}</span>
        <strong>{english ? previous.title : previous.subtitle}</strong>
      </Link>
      <Link className="effect-index-link" href={home}>{english ? "All work" : "作品目录"}</Link>
      <Link className="effect-adjacent effect-adjacent-next" href={`${prefix}/effects/${next.slug}/`} rel="next">
        <span>{english ? "Next" : "下一个"}<ArrowRight aria-hidden="true" /></span>
        <strong>{english ? next.title : next.subtitle}</strong>
      </Link>
    </nav>
  </main>
}
