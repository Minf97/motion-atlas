"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import { usePathname } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { entranceDrawingDuration, entranceSessionKey, entranceStrokes, nextEntrancePhase, type EntrancePhase } from "@/lib/entrance"

export function Entrance({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<EntrancePhase>("loading")
  const english = usePathname().startsWith("/en")
  const skipped = useSyncExternalStore(() => () => {}, () => sessionStorage.getItem(entranceSessionKey) === "1" || Boolean(location.hash), () => false)
  const blocked = !skipped && phase !== "done"
  const button = useRef<HTMLButtonElement>(null)
  const content = useRef<HTMLDivElement>(null)

  // 等待字体就绪
  useEffect(() => {
    if (skipped) {
      sessionStorage.setItem(entranceSessionKey, "1")
      return
    }
    let active = true
    let timer: ReturnType<typeof setTimeout>
    const delay = new Promise<void>(resolve => { timer = setTimeout(resolve, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : entranceDrawingDuration) })
    void Promise.all([document.fonts.ready, delay]).then(() => {
      if (active) setPhase(current => nextEntrancePhase(current, "loaded"))
    })
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [skipped])

  useEffect(() => {
    if (phase === "ready") button.current?.focus({ preventScroll: true })
    if (phase === "done") content.current?.focus({ preventScroll: true })
  }, [phase])

  useEffect(() => {
    if (!blocked) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = previous }
  }, [blocked])

  // 揭开作品目录
  function enter() {
    setPhase(current => nextEntrancePhase(current, "enter"))
  }

  function finish() {
    sessionStorage.setItem(entranceSessionKey, "1")
    setPhase(current => nextEntrancePhase(current, "finished"))
  }

  return <>
    <div ref={content} className="entrance-content" inert={blocked} tabIndex={-1}>{children}</div>
    {blocked && <div className={`minf-entrance entrance-${phase}`} role="dialog" aria-modal="true" aria-label={english ? "Welcome to Minf" : "欢迎来到 Minf"} onAnimationEnd={event => {
      if (event.target === event.currentTarget && phase === "leaving") finish()
    }}>
      <div className="entrance-brand">
        <svg className="entrance-wordmark" viewBox="0 0 240 150" role="img" aria-label="Minf">
          {entranceStrokes.map(stroke => <path key={stroke.letter} d={stroke.path} pathLength="1" style={{ animationDelay: `${stroke.delay}ms`, animationDuration: `${stroke.duration}ms` }} />)}
        </svg>
      </div>
      <button ref={button} className="entrance-enter" disabled={phase !== "ready"} onClick={enter} aria-label={english ? "Enter portfolio" : "进入作品集"}>
        <ArrowRight aria-hidden="true" />
      </button>
      <span className="entrance-status" role="status">{phase === "loading" ? (english ? "Preparing the details" : "正在准备细节") : (english ? "Enter" : "进入")}</span>
    </div>}
  </>
}
