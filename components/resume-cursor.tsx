"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion"
import { cursorGeometry, cursorSpring, type CursorMode } from "@/lib/resume-cursor"

// 复刻鼠标吸附
export function ResumeCursor() {
  const [enabled, setEnabled] = useState(false)
  const [visible, setVisible] = useState(false)
  const [pressed, setPressed] = useState(false)
  const [caption, setCaption] = useState("")
  const [shape, setShape] = useState({ width: 20, height: 20, radius: 20, block: false })
  const active = useRef<HTMLElement | null>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, cursorSpring)
  const springY = useSpring(y, cursorSpring)

  useEffect(() => {
    const page = document.querySelector<HTMLElement>(".resume-page")!
    const query = window.matchMedia("(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)")
    const sync = () => {
      setEnabled(query.matches)
      page.classList.toggle("resume-custom-cursor", query.matches)
    }
    sync()
    query.addEventListener("change", sync)

    let bounds = { left: 0, top: 0, width: 0, height: 0 }
    // 还原元素位置
    const reset = () => {
      if (active.current) {
        active.current.style.transform = ""
        active.current.style.scale = ""
        active.current = null
      }
    }
    // 识别悬停目标
    const move = (event: PointerEvent) => {
      if (!query.matches || event.pointerType === "touch") return
      const target = event.target
      if (!(target instanceof HTMLElement) || !page.contains(target)) {
        reset(); setVisible(false); setCaption(""); return
      }
      setVisible(true)
      const marked = target.closest<HTMLElement>("[data-cursor]")
      const interactive = target.closest<HTMLElement>("a, button, summary")
      const text = target.childNodes.length === 1 && target.firstChild?.nodeType === Node.TEXT_NODE && target.textContent?.trim()
      const element = marked ?? interactive ?? target
      const mode: CursorMode = marked ? marked.dataset.cursor as CursorMode : interactive ? "a" : text ? "text" : "default"
      if (active.current !== element) {
        reset()
        const rect = element.getBoundingClientRect()
        bounds = { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
        if (mode === "block" || mode === "a") active.current = element
      }
      const geometry = cursorGeometry(mode, event.clientX, event.clientY, bounds, parseFloat(getComputedStyle(element).lineHeight))
      x.set(geometry.x); y.set(geometry.y)
      setShape({ width: geometry.width, height: geometry.height, radius: geometry.radius, block: mode === "block" })
      if (active.current) {
        element.style.transform = `translate(${geometry.shiftX}px, ${geometry.shiftY}px)`
        element.style.scale = String(geometry.scale)
      }
      setCaption(target.closest<HTMLElement>("[data-voice]")?.dataset.voice ?? "")
    }
    const leave = () => { reset(); setVisible(false); setCaption("") }
    const down = () => setPressed(true)
    const up = () => setPressed(false)
    const scroll = () => {
      reset(); setCaption("")
      setShape({ width: 20, height: 20, radius: 20, block: false })
    }
    document.addEventListener("pointermove", move)
    document.addEventListener("pointerleave", leave)
    document.addEventListener("pointerdown", down)
    document.addEventListener("pointerup", up)
    window.addEventListener("blur", leave)
    window.addEventListener("scroll", scroll, { passive: true })
    return () => {
      reset(); page.classList.remove("resume-custom-cursor")
      query.removeEventListener("change", sync)
      document.removeEventListener("pointermove", move)
      document.removeEventListener("pointerleave", leave)
      document.removeEventListener("pointerdown", down)
      document.removeEventListener("pointerup", up)
      window.removeEventListener("blur", leave)
      window.removeEventListener("scroll", scroll)
    }
  }, [x, y])

  return <>
    <AnimatePresence>{enabled && <motion.div className="resume-pointer" aria-hidden="true"
      style={{ left: springX, top: springY }} initial={{ opacity: 0, scale: 3 }} exit={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0, scale: pressed ? 0.9 : 1, width: shape.width, height: shape.height, borderRadius: shape.radius, backgroundColor: shape.block ? "rgba(140,140,140,0.2)" : "rgba(140,140,140,0.65)" }} />}</AnimatePresence>
    <AnimatePresence>{enabled && caption && <motion.div key={caption} className="resume-caption" aria-hidden="true"
      initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} transition={{ duration: 0.3 }}>
      {caption.split(" ").map((word, index) => <motion.span key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.03 }}>{word}{" "}</motion.span>)}
    </motion.div>}</AnimatePresence>
  </>
}
