import Link from "next/link"
import { ArrowDownRight, ArrowUpRight, Asterisk } from "lucide-react"
import { Button } from "@/components/ui/button"
import { effects, type Effect, type EffectGroup } from "@/lib/effects"

const catalogue: { id: string; number: string; title: string; note: string; groups: EffectGroup[] }[] = [
  { id: "loading", number: "01", title: "Loading", note: "首次进入与页面之间的切换", groups: ["Splash", "Transition"] },
  { id: "scrolling", number: "02", title: "Scrolling", note: "由滚动触发，或由滚动精确驱动", groups: ["Scroll Trigger", "Scroll Driven"] },
  { id: "smooth", number: "03", title: "Smooth Scrolling", note: "抵达某个位置的手感", groups: ["Lenis"] },
]

const groupNames: Record<EffectGroup, string> = {
  Splash: "首次进入",
  Transition: "页面转场",
  "Scroll Trigger": "滚动触发",
  "Scroll Driven": "滚动驱动",
  Lenis: "滚动缓动",
}

// 渲染案例索引
function EffectRows({ items }: { items: Effect[] }) {
  return <div className="index-rows">{items.map((effect) => <article className="index-row" key={effect.slug}>
    <Link className="index-row-main" href={`/effects/${effect.slug}`}>
      <span className="index-number">{effect.number}</span>
      <span className="index-row-name"><strong>{effect.subtitle}</strong><small>{effect.title}</small></span>
      <span className="index-row-cue">{effect.reference.cue}</span>
      <ArrowUpRight aria-hidden="true" />
    </Link>
    <a className="index-row-reference" href={effect.reference.url} target="_blank" rel="noopener noreferrer" aria-label={`查看 ${effect.reference.name} 原站`}>
      参考 / {effect.reference.name} ↗
    </a>
  </article>)}</div>
}

export default function Page() {
  return <main className="site-shell index-shell" id="top">
    <header className="site-header">
      <Link href="/" className="brand" aria-label="Motion Atlas 首页"><Asterisk aria-hidden="true" /><span>MOTION<br />ATLAS<span className="brand-dot">.</span></span></Link>
      <div className="header-caption">A curated collection of<br />frontend motion studies</div>
      <nav aria-label="分类导航" className="header-nav"><a href="#loading">Loading</a><a href="#scrolling">Scrolling</a><a href="#smooth">Smooth</a></nav>
      <span className="header-index">INDEX / 2026</span>
    </header>

    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <div className="eyebrow"><span className="live-dot" /> FRONTEND MOTION INDEX <span className="eyebrow-line" /> 14 STUDIES</div>
        <h1 id="hero-title">The motion<br /><em>index</em><span className="hero-period">.</span></h1>
        <div className="hero-bottom"><p>一个可以逐项打开的动效目录。<br />每个案例都有明确的原站与观察入口。</p><Button asChild size="lg" className="hero-cta"><a href="#directory">查看目录 <ArrowDownRight data-icon="inline-end" /></a></Button></div>
      </div>
      <div className="hero-art hero-contact" aria-label="Lusion、Filmbot 与 Jealous Films 的案例预览">
        <div className="hero-contact-top"><span>SELECTED REFERENCES</span><span>01 — 14</span></div>
        <figure className="hero-contact-image hero-contact-lusion"><figcaption>LUSION　/　LOADING</figcaption></figure>
        <figure className="hero-contact-image hero-contact-filmbot"><figcaption>FILMBOT　/　SCROLLING</figcaption></figure>
        <figure className="hero-contact-image hero-contact-jealous"><figcaption>JEALOUS FILMS　/　TRANSITION</figcaption></figure>
      </div>
      <div className="hero-footer"><span>SCROLL TO EXPLORE ↓</span><span>14 STUDIES / 03 CATEGORIES</span></div>
    </section>

    <nav className="directory-map" id="directory" aria-label="完整案例目录">
      <div className="directory-map-heading"><span>DIRECTORY</span><p>从类型找到动作，<br />再进入完整演示。</p></div>
      <div className="directory-map-columns">{catalogue.map((category) => <div className="directory-map-column" key={category.id}>
        <a className="directory-map-title" href={`#${category.id}`}><span>{category.number}</span><strong>{category.title}</strong><ArrowDownRight aria-hidden="true" /></a>
        {category.groups.map((group) => <div className="directory-map-group" key={group}>
          <span>{group} <em>/ {groupNames[group]}</em></span>
          {effects.filter((effect) => effect.group === group).map((effect) => <Link href={`/effects/${effect.slug}`} key={effect.slug}>{effect.subtitle}</Link>)}
        </div>)}
      </div>)}</div>
    </nav>

    {catalogue.map((category) => <section className="index-section" id={category.id} key={category.id} aria-labelledby={`${category.id}-title`}>
      <div className="index-section-heading"><span>{category.number} / 03</span><h2 id={`${category.id}-title`}>{category.title}</h2><p>{category.note}</p></div>
      {category.groups.map((group) => <div className="index-group" key={group}>
        <div className="index-group-heading"><span>{group}</span><span>{groupNames[group]}</span><span>{String(effects.filter((effect) => effect.group === group).length).padStart(2, "0")}</span></div>
        <EffectRows items={effects.filter((effect) => effect.group === group)} />
      </div>)}
    </section>)}

    <footer className="site-footer"><div><Asterisk aria-hidden="true" /><span>Motion Atlas<br />An index of observed interactions.</span></div><a href="#top">BACK TO TOP ↑</a><span>© MOTION ATLAS — 2026</span></footer>
  </main>
}
