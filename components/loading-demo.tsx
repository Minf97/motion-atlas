"use client"

import { useEffect, useState } from "react"
import NextImage from "next/image"
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { amaterasuCoverFrame, amaterasuFrame, amaterasuFrameCount, amaterasuFrameUrl, amaterasuPageName } from "@/lib/amaterasu"

function SplashDemo({ english }: { english: boolean }) {
  const [cycle, setCycle] = useState(0)
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<"idle" | "loading" | "revealing">("idle")

  // 推进加载数字
  useEffect(() => {
    if (!cycle) return
    const start = performance.now()
    let frame = 0
    let exitTimer = 0
    const update = (time: number) => {
      const next = Math.min(100, Math.floor(((time - start) / 2150) * 100))
      setProgress(next)
      if (next < 100) frame = requestAnimationFrame(update)
      else {
        setPhase("revealing")
        exitTimer = window.setTimeout(() => setPhase("idle"), 900)
      }
    }
    frame = requestAnimationFrame(update)
    return () => { cancelAnimationFrame(frame); clearTimeout(exitTimer) }
  }, [cycle])

  return <div className="loading-stage lusion-stage">
    <div className="lusion-arrival"><div className="lusion-arrival-header"><span>LUSION</span><p>We create 3D visual storytelling<br />and interactive web experiences<br />that help brands stand out</p><span>MENU ··</span></div><div className="lusion-arrival-art" role="img" aria-label={english ? "Blue, black and white tubular installation" : "蓝黑白管状装置"} /><small>+　　　　　　　　　SCROLL TO EXPLORE　　　　　　　　　+</small></div>
    {phase !== "idle" && <div className={`lusion-loader ${phase}`} aria-live="polite"><div className="lusion-load-bar"><span style={{ width: `${progress}%` }} /></div><strong>{String(progress).padStart(3, "0")}</strong></div>}
    <Button className="stage-action" disabled={phase !== "idle"} onClick={() => { setProgress(0); setPhase("loading"); setCycle((value) => value + 1) }}><RotateCcw data-icon="inline-start" /> {english ? "Replay Loading" : "重播 Loading"}</Button>
  </div>
}

function MaskDemo({ english }: { english: boolean }) {
  const [page, setPage] = useState(0)
  const [phase, setPhase] = useState<"idle" | "playing">("idle")
  const [frame, setFrame] = useState(0)
  const [ready, setReady] = useState(false)

  // 预载原站遮罩
  useEffect(() => {
    let active = true
    const images = Array.from({ length: amaterasuFrameCount }, () => new Image())
    Promise.all(images.map((image, index) => new Promise<void>((resolve, reject) => {
      image.onload = () => resolve()
      image.onerror = () => reject(new Error(`Amaterasu frame ${index} failed to load`))
      image.src = amaterasuFrameUrl(index)
    }))).then(() => { if (active) setReady(true) }).catch((error) => { throw error })
    return () => { active = false }
  }, [])

  // 白场切换页面
  useEffect(() => {
    if (phase !== "playing") return
    const start = performance.now()
    let switched = false
    let animation = 0
    const update = (time: number) => {
      const nextFrame = amaterasuFrame(time - start)
      setFrame(nextFrame)
      if (nextFrame >= amaterasuCoverFrame && !switched) {
        switched = true
        setPage((value) => 1 - value)
      }
      if (nextFrame < amaterasuFrameCount - 1) animation = requestAnimationFrame(update)
      else setPhase("idle")
    }
    animation = requestAnimationFrame(update)
    return () => cancelAnimationFrame(animation)
  }, [phase])

  return <div className={`loading-stage amaterasu-stage ama-page-${page}`}>
    <div className="ama-page" style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/reference/amaterasu-vision.webp)` }}><div className="ama-nav"><span>AMATERASU</span><span>{amaterasuPageName(page).toUpperCase()}　☷</span></div>{page ? <div className="ama-aleph"><strong>λ0</strong><div><small>MEET ALEPH</small><p>We are designing Aleph to surpass classical diagnostic methods in orders of magnitude, in both accuracy and speed.</p></div></div> : <div className="ama-content"><strong>Empower<br />your mental<br />health journey</strong><button className="ama-enter" disabled={!ready || phase !== "idle"} onClick={() => setPhase("playing")}>START YOUR JOURNEY ↗</button><p>Amaterasu is a physics cognition lab working at the intersection of technology and nature to transform mental health.</p></div>}<span className="ama-scroll">SCROLL TO EXPLORE ↓</span></div>
    {phase === "playing" && <NextImage className="ama-curtain" src={amaterasuFrameUrl(frame)} alt="" width={1920} height={1080} unoptimized />}
    <Button className="stage-action" disabled={!ready || phase !== "idle"} onClick={() => setPhase("playing")}>{english ? "Switch to" : "切换"} {amaterasuPageName(1 - page)} <ArrowRight data-icon="inline-end" /></Button>
  </div>
}

function OverlapDemo({ english }: { english: boolean }) {
  const [expanded, setExpanded] = useState(false)
  return <div className={`loading-stage jealous-stage ${expanded ? "is-expanded" : ""}`}>
    <div className="jealous-list"><div className="jealous-logo">J　E<br /> A　L　O<br />　U　S .</div><strong>work</strong><div className="jealous-grid"><div /><div /><div /><div /></div></div>
    <div className="jealous-detail"><span>SAY NOW — BITCH GET OUT MY CAR</span><div className="jealous-film" /><small>01 / SELECTED WORK</small></div>
    <Button className="stage-action" onClick={() => setExpanded(!expanded)}>{expanded ? <ArrowLeft data-icon="inline-start" /> : null}{expanded ? (english ? "Back to work" : "返回作品列表") : (english ? "Open work" : "打开作品")}{!expanded ? <ArrowRight data-icon="inline-end" /> : null}</Button>
  </div>
}

function SharedDemo({ english }: { english: boolean }) {
  const [expanded, setExpanded] = useState(false)
  return <div className={`loading-stage ruba-stage ${expanded ? "is-expanded" : ""}`}>
    <div className="ruba-nav"><span>Ruba</span><span>Menu</span></div>
    <div className="ruba-list"><p>Gestalten, planen, produzieren – mit Exzellenz und Leidenschaft kreieren wir exklusive Objekte</p><span>Pfarrhaus Altstadt Winterthur — Arbeiten und Gewerbe</span></div>
    <div className="ruba-photo" role="img" aria-label={english ? "Historic building project" : "历史建筑项目图片"} />
    <div className="ruba-detail"><small>← Alle Projekte</small><strong>Pfarrhaus Altstadt<br />Winterthur</strong><span>Arbeiten und Gewerbe</span></div>
    <Button className="stage-action" onClick={() => setExpanded(!expanded)}>{expanded ? (english ? "Back to list" : "返回列表") : (english ? "Open project" : "打开项目")} <ArrowRight data-icon="inline-end" /></Button>
  </div>
}

export function LoadingDemo({ slug, english = false }: { slug: string; english?: boolean }) {
  if (slug === "splash") return <SplashDemo english={english} />
  if (slug === "mask-transition") return <MaskDemo english={english} />
  if (slug === "overlap-transition") return <OverlapDemo english={english} />
  return <SharedDemo english={english} />
}
