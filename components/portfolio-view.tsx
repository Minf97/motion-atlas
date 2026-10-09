import Link from "next/link"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { effectDescriptions } from "@/lib/effects-en"
import { effects, type EffectGroup } from "@/lib/effects"

const categories: { id: string; number: string; title: string; description: string; groups: { name: EffectGroup; label: string }[] }[] = [
  { id: "loading", number: "01", title: "Loading", description: "进入一个页面，以及离开它。", groups: [{ name: "Splash", label: "首次进入" }, { name: "Transition", label: "页面转场" }] },
  { id: "scrolling", number: "02", title: "Scrolling", description: "滚动既可以触发动作，也可以控制动作的进度。", groups: [{ name: "Scroll Trigger", label: "滚动触发" }, { name: "Scroll Driven", label: "滚动驱动" }] },
  { id: "smooth", number: "03", title: "Smooth Scrolling", description: "用缓动改变页面到达目标位置的方式。", groups: [{ name: "Lenis", label: "缓动滚动" }] },
]

export function PortfolioView({ english = false }: { english?: boolean }) {
  return <main className="portfolio-page" id="top" lang={english ? "en" : "zh-CN"}>
    <SiteHeader english={english} />

    <section className="portfolio-intro" aria-labelledby="portfolio-title">
      <span className="portfolio-overline">SELECTED WORK · 2026</span>
      <h1 id="portfolio-title">{english ? <>Frontend<br />interactions.</> : <>前端交互<br />作品集。</>}</h1>
      <div className="portfolio-intro-bottom"><p>{english ? "I’m Yuquan Xu, a frontend engineer. These studies explore page loading, transitions and scroll interactions. Open a study to try it." : "我是胥昱全，一名前端工程师。这里收录我对网页加载、页面转场与滚动交互的实践。点击任一案例，可以直接体验它的运动方式。"}</p><a href="#work">{english ? "Explore work" : "浏览作品"} <ArrowDownRight aria-hidden="true" /></a></div>
    </section>

    <div className="portfolio-work" id="work">
      <div className="portfolio-work-heading"><span>{english ? "Work index" : "作品目录"}</span><span>{effects.length} {english ? "studies / 03 categories" : "个交互案例 / 03 个类别"}</span></div>
      {categories.map((category) => <section className="portfolio-category" id={category.id} key={category.id} aria-labelledby={`${category.id}-title`}>
        <div className="portfolio-category-heading"><span>{category.number} / 03</span><div><h2 id={`${category.id}-title`}>{category.title}</h2><p>{english ? ["Arriving at a page, and leaving it.", "Scrolling triggers motion or controls its progress.", "Easing the journey to a target position."][Number(category.number) - 1] : category.description}</p></div></div>
        <div className="portfolio-category-content">{category.groups.map((group) => <div className="portfolio-group" key={group.name}>
          <h3><span>{group.name}</span>{!english && <small>{group.label}</small>}</h3>
          <div className="portfolio-case-list">{effects.filter((effect) => effect.group === group.name).map((effect) => <Link className="portfolio-case" href={`${english ? "/en" : ""}/effects/${effect.slug}`} key={effect.slug}>
            <span className="portfolio-case-number">{effect.number}</span><span className="portfolio-case-title">{english ? effect.title : <>{effect.subtitle}<small>{effect.title}</small></>}</span><span className="portfolio-case-description">{english ? effectDescriptions[Number(effect.number) - 1] : effect.description}</span><ArrowUpRight aria-hidden="true" />
          </Link>)}</div>
        </div>)}</div>
      </section>)}
    </div>

    <footer className="portfolio-footer"><span>{english ? "Yuquan Xu · Frontend & interaction design" : "胥昱全 · 前端开发与交互设计"}</span><Link href={english ? "/en/resume" : "/resume"}>{english ? "View resume" : "查看简历"} <ArrowUpRight aria-hidden="true" /></Link><a href="#top">{english ? "Back to top ↑" : "返回顶部 ↑"}</a></footer>
  </main>
}
