"use client"

import { useEffect, useRef, useState } from "react"
import { scrollProgress } from "@/lib/progress"
import { DrivenStudy } from "@/components/driven-study"

// 同步滚动进度
function useTrackProgress() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const track = trackRef.current
        if (!track) return
        const bounds = track.getBoundingClientRect()
        setProgress(scrollProgress(bounds.top, bounds.height, window.innerHeight))
      })
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])

  return { trackRef, progress }
}

function TriggerDemo() {
  const [visible, setVisible] = useState<number[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setVisible((current) => current.includes(Number(entry.target.getAttribute("data-index"))) ? current : [...current, Number(entry.target.getAttribute("data-index"))])
      })
    }, { threshold: 0.45 })
    containerRef.current?.querySelectorAll("[data-index]").forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  const projects = [
    { name: "Oryzo AI", role: "CONCEPT · WEB · DESIGN · 3D", image: "https://lusion.dev/assets/projects/oryzo_ai/home.webp" },
    { name: "Atlas Motion", role: "WEB · DESIGN · DEVELOPMENT · 3D", image: "https://lusion.dev/assets/projects/atlas_motion/home.webp" },
    { name: "Devin AI", role: "WEB · DESIGN · DEVELOPMENT", image: "https://lusion.dev/assets/projects/devin_ai/home.webp" },
    { name: "Of The Oak", role: "WEB · DESIGN · DEVELOPMENT · 3D", image: "https://lusion.dev/assets/projects/of_the_oak/home.webp" },
  ]

  return <div className="lusion-trigger" ref={containerRef}>
    <div className="lusion-trigger-nav"><strong>LUSION</strong><span>LET&apos;S TALK　 ·　 MENU</span></div>
    <div className="lusion-trigger-intro"><h2>Featured Work</h2><p>A SELECTION OF IMMERSIVE DIGITAL EXPERIENCES CREATED FOR AMBITIOUS BRANDS AND FORWARD THINKING TEAMS.</p></div>
    <div className="lusion-trigger-grid">{projects.map((project, index) => <article className={`lusion-trigger-project ${visible.includes(index) ? "is-visible" : ""}`} data-index={index} key={project.name}>
      <div className="lusion-trigger-image" style={{ backgroundImage: `url(${project.image})` }} /><div className="lusion-trigger-meta"><strong>{project.name}</strong><span>{project.role}</span></div>
    </article>)}</div>
  </div>
}

export function ScrollDemo({ slug }: { slug: string }) {
  const { trackRef, progress } = useTrackProgress()
  if (slug === "scroll-trigger") return <TriggerDemo />

  return <div className="scroll-track" ref={trackRef}><div className="scroll-sticky"><div className="scroll-stage reference-stage"><DrivenStudy slug={slug} progress={progress} /><div className="reference-stage-progress"><span>SCROLL TO EXPLORE</span><div><i style={{ width: `${progress * 100}%` }} /></div><span>{String(Math.round(progress * 100)).padStart(3, "0")}%</span></div></div></div></div>
}
