import Link from "next/link"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { effectDescriptions } from "@/lib/effects-en"
import { effects, type EffectGroup } from "@/lib/effects"
import { splineWorks } from "@/lib/spline-works"

const categories: {
  id: string
  number: string
  title: string
  description: string
  groups: { name: EffectGroup; label: string }[]
}[] = [
  {
    id: "loading",
    number: "01",
    title: "Loading",
    description: "",
    groups: [
      { name: "Splash", label: "首次进入" },
      { name: "Transition", label: "页面转场" },
    ],
  },
  {
    id: "scrolling",
    number: "02",
    title: "Scrolling",
    description: "",
    groups: [
      { name: "Scroll Trigger", label: "滚动触发" },
      { name: "Scroll Driven", label: "滚动驱动" },
    ],
  },
  {
    id: "smooth",
    number: "03",
    title: "Smooth Scrolling",
    description: "",
    groups: [{ name: "Lenis", label: "缓动滚动" }],
  },
]

export function PortfolioView({ english = false }: { english?: boolean }) {
  return (
    <main className="portfolio-page" id="top" lang={english ? "en" : "zh-CN"}>
      <SiteHeader english={english} />

      <div className="portfolio-work" id="work">
        {categories.map((category) => (
          <section
            className="portfolio-category"
            id={category.id}
            key={category.id}
            aria-labelledby={`${category.id}-title`}
          >
            <div className="portfolio-category-heading">
              <span>{category.number} / 04</span>
              <div>
                <h2 id={`${category.id}-title`}>{category.title}</h2>
                <p>
                  {category.description}
                </p>
              </div>
            </div>
            <div className="portfolio-category-content">
              {category.groups.map((group) => (
                <div className="portfolio-group" key={group.name}>
                  <h3>
                    <span>{group.name}</span>
                    {!english && <small>{group.label}</small>}
                  </h3>
                  <div className="portfolio-case-list">
                    {effects
                      .filter((effect) => effect.group === group.name)
                      .map((effect) => (
                        <Link
                          className="portfolio-case"
                          href={`${english ? "/en" : ""}/effects/${effect.slug}`}
                          key={effect.slug}
                        >
                          <span className="portfolio-case-number">
                            {effect.number}
                          </span>
                          <span className="portfolio-case-title">
                            {english ? (
                              effect.title
                            ) : (
                              <>
                                {effect.subtitle}
                                <small>{effect.title}</small>
                              </>
                            )}
                          </span>
                          <span className="portfolio-case-description">
                            {english
                              ? effectDescriptions[Number(effect.number) - 1]
                              : effect.description}
                          </span>
                          <ArrowUpRight aria-hidden="true" />
                        </Link>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
        <section className="portfolio-category" id="spline" aria-labelledby="spline-title">
          <div className="portfolio-category-heading"><span>04 / 04</span><h2 id="spline-title">Spline</h2></div>
          <div className="portfolio-category-content">
            <div className="portfolio-group">
              <h3><span>3D Works</span>{!english && <small>三维作品</small>}</h3>
              <div className="portfolio-case-list">
                {splineWorks.map(work => <Link className="portfolio-case" href={`${english ? "/en" : ""}/spline/${work.id}`} key={work.id}>
                  <span className="portfolio-case-number">{work.number}</span>
                  <span className="portfolio-case-title">{english ? work.titleEn : work.title}</span>
                  <span className="portfolio-case-description">{english ? "Made in Spline" : "使用 Spline 制作"}</span>
                  <ArrowUpRight aria-hidden="true" />
                </Link>)}
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer className="portfolio-footer">
        <span>Minf · Frontend & interaction design</span>
        <a href="#top">{english ? "Back to top ↑" : "返回顶部 ↑"}</a>
      </footer>
    </main>
  )
}
