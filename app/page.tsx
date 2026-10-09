import Link from "next/link"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { effects, type EffectGroup } from "@/lib/effects"

const categories: { id: string; number: string; title: string; description: string; groups: { name: EffectGroup; label: string }[] }[] = [
  { id: "loading", number: "01", title: "Loading", description: "进入一个页面，以及离开它。", groups: [{ name: "Splash", label: "首次进入" }, { name: "Transition", label: "页面转场" }] },
  { id: "scrolling", number: "02", title: "Scrolling", description: "滚动既可以触发动作，也可以控制动作的进度。", groups: [{ name: "Scroll Trigger", label: "滚动触发" }, { name: "Scroll Driven", label: "滚动驱动" }] },
  { id: "smooth", number: "03", title: "Smooth Scrolling", description: "用缓动改变页面到达目标位置的方式。", groups: [{ name: "Lenis", label: "缓动滚动" }] },
]

export default function Page() {
  return <main className="portfolio-page" id="top">
    <header className="portfolio-header">
      <Link href="/" className="portfolio-name">胥昱全<span> / Frontend Engineer</span></Link>
      <nav aria-label="主导航"><a href="#work">作品</a><Link href="/resume">简历 <ArrowUpRight aria-hidden="true" /></Link></nav>
    </header>

    <section className="portfolio-intro" aria-labelledby="portfolio-title">
      <span className="portfolio-overline">SELECTED WORK · 2026</span>
      <h1 id="portfolio-title">前端交互<br />作品集。</h1>
      <div className="portfolio-intro-bottom"><p>我是胥昱全，一名前端工程师。这里收录我对网页加载、页面转场与滚动交互的实践。点击任一案例，可以直接体验它的运动方式。</p><a href="#work">浏览作品 <ArrowDownRight aria-hidden="true" /></a></div>
    </section>

    <div className="portfolio-work" id="work">
      <div className="portfolio-work-heading"><span>作品目录</span><span>{effects.length} 个交互案例 / 03 个类别</span></div>
      {categories.map((category) => <section className="portfolio-category" id={category.id} key={category.id} aria-labelledby={`${category.id}-title`}>
        <div className="portfolio-category-heading"><span>{category.number} / 03</span><div><h2 id={`${category.id}-title`}>{category.title}</h2><p>{category.description}</p></div></div>
        <div className="portfolio-category-content">{category.groups.map((group) => <div className="portfolio-group" key={group.name}>
          <h3><span>{group.name}</span><small>{group.label}</small></h3>
          <div className="portfolio-case-list">{effects.filter((effect) => effect.group === group.name).map((effect) => <Link className="portfolio-case" href={`/effects/${effect.slug}`} key={effect.slug}>
            <span className="portfolio-case-number">{effect.number}</span><span className="portfolio-case-title">{effect.subtitle}<small>{effect.title}</small></span><span className="portfolio-case-description">{effect.description}</span><ArrowUpRight aria-hidden="true" />
          </Link>)}</div>
        </div>)}</div>
      </section>)}
    </div>

    <footer className="portfolio-footer"><span>胥昱全 · 前端开发与交互设计</span><Link href="/resume">查看简历 <ArrowUpRight aria-hidden="true" /></Link><a href="#top">返回顶部 ↑</a></footer>
  </main>
}
