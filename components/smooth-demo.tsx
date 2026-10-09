"use client"

import { useEffect, useRef, useState } from "react"
import Lenis from "lenis"
import { Button } from "@/components/ui/button"

export function SmoothDemo({ english = false }: { english?: boolean }) {
  const [enabled, setEnabled] = useState(true)
  const lenisRef = useRef<Lenis | null>(null)

  // 启停缓动滚动
  useEffect(() => {
    if (!enabled) return
    const lenis = new Lenis({ duration: 1.25, smoothWheel: true, touchMultiplier: 1.1 })
    lenisRef.current = lenis
    let frame = 0
    const animate = (time: number) => { lenis.raf(time); frame = requestAnimationFrame(animate) }
    frame = requestAnimationFrame(animate)
    return () => { cancelAnimationFrame(frame); lenis.destroy(); lenisRef.current = null }
  }, [enabled])

  // 跳转指定章节
  function goTo(id: string) {
    if (enabled) lenisRef.current?.scrollTo(`#${id}`, { offset: -24 })
    else document.getElementById(id)?.scrollIntoView({ behavior: "instant" })
  }

  return <div className="lenis-demo">
    <nav className="lenis-nav"><span>SHOWCASE　 TEMPLATES　 SUBMIT</span><strong>ℓ</strong><span>DOCUMENTATION　 SPONSOR</span></nav>
    <section className="lenis-hero"><strong className="lenis-wordmark">LENIS</strong><span className="lenis-subtitle">SMOOTH SCROLL</span><div className="lenis-hero-bottom"><span>SCROLL<br />TO EXPLORE</span><p>THE SMOOTH SCROLL LIBRARY<br />BY DARKROOM.ENGINEERING</p><Button onClick={() => goTo("smooth-two")}>EXPLORE ↓</Button></div></section>
    <div className="lenis-switch"><span>COMPARE THE FEEL</span><div><Button size="sm" aria-pressed={enabled} onClick={() => setEnabled(true)}>LENIS ON</Button><Button size="sm" aria-pressed={!enabled} onClick={() => setEnabled(false)}>NATIVE</Button></div></div>
    <section id="smooth-two" className="lenis-chapter lenis-chapter-two"><span>01 / THE JOURNEY</span><strong>Scroll<br /><em>without</em><br />friction.</strong><p>{english ? "Switch modes and use the buttons below to compare how the page arrives at each section." : "切换模式，再点击下方按钮。观察页面从一个段落到下一个段落的停靠方式。"}</p><Button onClick={() => goTo("smooth-three")}>NEXT CHAPTER ↘</Button></section>
    <section id="smooth-three" className="lenis-chapter lenis-chapter-three"><span>02 / THE ARRIVAL</span><strong>Land<br /><em>gently.</em></strong><p>{english ? "Feel the easing as you scroll in either direction. Turn Lenis off to compare native scrolling." : "向上、向下都能感受到 Lenis 的缓动。关闭后对比浏览器原生滚动。"}</p><Button onClick={() => goTo("smooth-top")}>BACK TO TOP ↑</Button></section>
  </div>
}
