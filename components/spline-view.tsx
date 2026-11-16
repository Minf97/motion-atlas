"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { Component, useState, type ReactNode } from "react"
import { ArrowLeft, RotateCcw } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { splineWorks } from "@/lib/spline-works"

// 按需加载场景
const Spline = dynamic(() => import("@splinetool/react-spline"), { ssr: false })

class SceneBoundary extends Component<
  { children: ReactNode; english: boolean },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null }

  static getDerivedStateFromError(error: Error) { return { error } }

  render() {
    if (this.state.error) return <div className="spline-status" role="alert">
      <p>{this.props.english ? "The scene could not be loaded." : "场景加载失败。"}</p>
      <p>{this.state.error.message}</p>
      <button onClick={() => window.location.reload()}>{this.props.english ? "Reload page" : "重新加载页面"}</button>
    </div>
    return this.props.children
  }
}

export function SplineView({ english = false }: { english?: boolean }) {
  const [activeId, setActiveId] = useState(splineWorks[0].id)
  const [loaded, setLoaded] = useState(false)
  const [revision, setRevision] = useState(0)
  const work = splineWorks.find(item => item.id === activeId)!

  return <main className="portfolio-page spline-page" id="top" lang={english ? "en" : "zh-CN"}>
    <SiteHeader english={english} path="/spline" />
    <div className="spline-heading">
      <Link className="spline-back" href={english ? "/en/#spline" : "/#spline"}>
        <ArrowLeft aria-hidden="true" />{english ? "All collections" : "返回合集"}
      </Link>
      <div className="spline-title"><h1>Spline</h1><p>{english ? "3D works by Minf" : "Minf 的 3D 作品"}</p></div>
    </div>
    <section aria-labelledby="spline-work-title">
      <div className="spline-toolbar">
        <h2 id="spline-work-title"><span>{work.number} /</span> {english ? work.titleEn : work.title}</h2>
        <button onClick={() => { setLoaded(false); setRevision(value => value + 1) }}>
          <RotateCcw aria-hidden="true" />{english ? "Restart" : "重新播放"}
        </button>
      </div>
      <div className="spline-stage" aria-label={english ? work.titleEn : work.title} aria-busy={!loaded}>
        <SceneBoundary key={`${work.id}-${revision}`} english={english}>
          {!loaded && <div className="spline-status" role="status">{english ? "Loading scene…" : "正在加载场景…"}</div>}
          <Spline className="spline-canvas" scene={work.scene} onLoad={() => setLoaded(true)} />
        </SceneBoundary>
      </div>
    </section>
    <nav className="spline-index" aria-label={english ? "3D works" : "3D 作品目录"}>
      <span>{english ? "Works" : "作品目录"} / {String(splineWorks.length).padStart(2, "0")}</span>
      {splineWorks.map(item => <button key={item.id} aria-current={activeId === item.id ? "true" : undefined} onClick={() => {
        if (activeId === item.id) return
        setLoaded(false)
        setActiveId(item.id)
      }}>{item.number} — {english ? item.titleEn : item.title}</button>)}
    </nav>
    <footer className="portfolio-footer"><span>Minf · Spline works</span><a href="#top">{english ? "Back to top ↑" : "返回顶部 ↑"}</a></footer>
  </main>
}
