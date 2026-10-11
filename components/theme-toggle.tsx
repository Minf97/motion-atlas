"use client"

import { useRef } from "react"
import { flushSync } from "react-dom"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { themeCircle } from "@/lib/theme-transition"

export function ThemeToggle({ english = false }: { english?: boolean }) {
  const { setTheme } = useTheme()
  const busy = useRef(false)

  // 编排主题转场
  async function toggle(event: React.MouseEvent<HTMLButtonElement>) {
    if (busy.current) return
    const dark = !document.documentElement.classList.contains("dark")
    const update = () => flushSync(() => setTheme(dark ? "dark" : "light"))
    if (!document.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      update()
      return
    }
    busy.current = true
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.detail === 0 ? rect.left + rect.width / 2 : event.clientX
    const y = event.detail === 0 ? rect.top + rect.height / 2 : event.clientY
    const frames = themeCircle(x, y, innerWidth, innerHeight)
    try {
      const transition = document.startViewTransition(update)
      await transition.ready
      await document.documentElement.animate({ clipPath: dark ? [...frames].reverse() : frames }, {
        duration: 400,
        easing: "ease-out",
        pseudoElement: dark ? "::view-transition-old(root)" : "::view-transition-new(root)",
      }).finished
      await transition.finished
    } finally {
      busy.current = false
    }
  }

  return <button className="theme-toggle" onClick={toggle} aria-label={english ? "Toggle light and dark theme" : "切换亮暗主题"} title={english ? "Toggle theme" : "切换亮暗主题"}>
    <Sun className="theme-sun" aria-hidden="true" />
    <Moon className="theme-moon" aria-hidden="true" />
  </button>
}
