"use client"

import { useEffect, useRef } from "react"
import { lawtedNextStage, lawtedStage, lawtedTransition } from "@/lib/lawted"
import { studyMedia } from "@/lib/study-media"

export function LawtedStudy({ progress }: { progress: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const progressRef = useRef(progress)
  const changeStageRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    progressRef.current = progress
    changeStageRef.current?.()
  }, [progress])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let active = true
    let application: import("@splinetool/runtime").Application | null = null
    let transitionTimer = 0

    // 加载原站场景
    async function loadScene() {
      const { Application } = await import("@splinetool/runtime")
      if (!active) return
      const spline = new Application(canvas!, { renderMode: "auto" })
      application = spline
      await spline.load(studyMedia.lawtedScene)
      if (!active) return
      let currentStage = 1

      // 滚动切换场景
      const changeStage = () => {
        const nextStage = lawtedStage(progressRef.current)
        if (nextStage === currentStage || transitionTimer) return
        const step = lawtedNextStage(currentStage, nextStage)
        const name = lawtedTransition(currentStage, step)
        const transition = spline.findObjectByName(name)
        if (!transition) throw new Error(`Lawted scene is missing ${name}`)
        transition.emitEvent("mouseDown")
        currentStage = step
        transitionTimer = window.setTimeout(() => {
          transitionTimer = 0
          changeStage()
        }, 900)
      }
      changeStageRef.current = changeStage
      changeStage()
    }
    loadScene().catch((error) => { throw error })

    return () => {
      active = false
      clearTimeout(transitionTimer)
      changeStageRef.current = null
      application?.dispose()
    }
  }, [])

  return <div className="lawted-study">
    <canvas ref={canvasRef} className="lawted-canvas" aria-label="Lawted 原站 Spline 场景，随滚动切换七个章节" role="img" />
    <nav className="lawted-nav"><strong>LAWTED</strong><span>AN IMMERSIVE 3D STORY</span><span>SCROLL TO EXPLORE ↓</span></nav>
    <div className="lawted-credits" style={{ opacity: Math.min(1, Math.max(0, (progress - 0.9) / 0.08)) }} aria-hidden={progress < 0.9}><span>Directed by</span><strong>Lawted Wu</strong><span>Written by</span><strong>Lawted Wu</strong><span>Sound Design by</span><strong>Ruby</strong></div>
    <div className="lawted-chapter"><span>CHAPTER</span><strong>{String(lawtedStage(progress)).padStart(2, "0")}</strong><span>/ 07</span></div>
  </div>
}
