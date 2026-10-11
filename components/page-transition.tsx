"use client"

import { createContext, useContext, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { PageMask } from "./page-mask"
import { isPortfolioTransition, nextPageTransition, type PageTransitionPhase } from "@/lib/page-transition"

const TransitionContext = createContext<(href: string) => boolean>(() => false)

export function PageTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [phase, setPhase] = useState<PageTransitionPhase>("idle")
  const pending = useRef<string | null>(null)
  const content = useRef<HTMLDivElement>(null)

  // 新页提交后揭幕
  useEffect(() => {
    if (phase !== "covered" || isPortfolioTransition(pathname, pending.current!)) return
    const frame = requestAnimationFrame(() => setPhase(current => nextPageTransition(current, "navigated")))
    return () => cancelAnimationFrame(frame)
  }, [pathname, phase])

  useEffect(() => {
    if (phase === "idle") return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = previous }
  }, [phase])

  // 盖住后再导航
  function navigate(href: string) {
    if (pending.current) return true
    if (!isPortfolioTransition(pathname, href) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false
    pending.current = href
    router.prefetch(href)
    setPhase(current => nextPageTransition(current, "start"))
    return true
  }

  function completeAnimation() {
    if (phase === "covering") {
      setPhase(current => nextPageTransition(current, "covered"))
      router.push(pending.current!)
    }
    if (phase === "revealing") {
      pending.current = null
      setPhase(current => nextPageTransition(current, "revealed"))
      content.current?.focus({ preventScroll: true })
    }
  }

  return <TransitionContext.Provider value={navigate}>
    <div className={`page-transition-content page-content-${phase}`} ref={content} tabIndex={-1} inert={phase !== "idle"}>{children}</div>
    <PageMask phase={phase} onComplete={completeAnimation} />
  </TransitionContext.Provider>
}

export function PageTransitionLink({ href, children, ...props }: React.ComponentProps<typeof Link> & { href: string }) {
  const navigate = useContext(TransitionContext)
  return <Link {...props} href={href} onNavigate={event => {
    if (navigate(href)) event.preventDefault()
  }}>{children}</Link>
}
