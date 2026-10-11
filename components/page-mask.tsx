"use client"

import { useEffect, useEffectEvent, useRef } from "react"
import { amaterasuCoverFrame, amaterasuFrame, amaterasuFrameCount, amaterasuFrameUrl } from "@/lib/amaterasu"
import { pageTransitionPlaybackRate, type PageTransitionPhase } from "@/lib/page-transition"

let sequence: Promise<HTMLImageElement[]> | undefined

// 复用案例帧图
function preloadSequence() {
  if (!sequence) sequence = Promise.all(Array.from({ length: amaterasuFrameCount }, (_, index) => new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error(`Transition frame ${index} failed to load`))
    image.src = amaterasuFrameUrl(index)
  })))
  return sequence
}

export function PageMask({ phase, onComplete }: { phase: PageTransitionPhase; onComplete: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const complete = useEffectEvent(onComplete)

  useEffect(() => { void preloadSequence() }, [])

  // 满屏时等待新页
  useEffect(() => {
    if (phase !== "covering" && phase !== "revealing") return
    let active = true
    let animation = 0
    void preloadSequence().then(images => {
      if (!active) return
      const surface = canvas.current!
      const context = surface.getContext("2d")
      if (!context) throw new Error("Page transition requires a 2D canvas context")
      surface.width = images[0].naturalWidth
      surface.height = images[0].naturalHeight
      const start = performance.now()
      const offset = phase === "revealing" ? amaterasuCoverFrame : 0
      const end = phase === "covering" ? amaterasuCoverFrame : amaterasuFrameCount - 1
      const update = (time: number) => {
        const frame = Math.min(end, offset + amaterasuFrame((time - start) * pageTransitionPlaybackRate))
        context.clearRect(0, 0, surface.width, surface.height)
        context.drawImage(images[frame], 0, 0, surface.width, surface.height)
        if (frame < end) animation = requestAnimationFrame(update)
        else complete()
      }
      animation = requestAnimationFrame(update)
    })
    return () => { active = false; cancelAnimationFrame(animation) }
  }, [phase])

  return <div className="page-mask" hidden={phase === "idle"} aria-hidden="true"><canvas ref={canvas} /></div>
}
