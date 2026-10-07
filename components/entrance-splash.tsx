"use client"

import { useEffect, useState } from "react"

export function EntranceSplash() {
  const [phase, setPhase] = useState<"loading" | "exit" | "done">("loading")
  const [progress, setProgress] = useState(0)

  // 首访播放加载
  useEffect(() => {
    if (sessionStorage.getItem("motion-atlas-entered")) {
      const skip = window.setTimeout(() => setPhase("done"), 0)
      return () => clearTimeout(skip)
    }
    sessionStorage.setItem("motion-atlas-entered", "1")
    const start = performance.now()
    let frame = 0
    let doneTimer = 0
    const update = (time: number) => {
      const next = Math.min(100, Math.floor(((time - start) / 1550) * 100))
      setProgress(next)
      if (next < 100) frame = requestAnimationFrame(update)
      else {
        setPhase("exit")
        doneTimer = window.setTimeout(() => setPhase("done"), 750)
      }
    }
    frame = requestAnimationFrame(update)
    return () => { cancelAnimationFrame(frame); clearTimeout(doneTimer) }
  }, [])

  if (phase === "done") return null
  return <div className={`entrance-splash lusion-entrance ${phase}`} aria-label={`正在加载，${progress}%`}><div className="lusion-load-bar"><span style={{ width: `${progress}%` }} /></div><strong>{String(progress).padStart(3, "0")}</strong></div>
}
