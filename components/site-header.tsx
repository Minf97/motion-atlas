import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"
import { PageTransitionLink } from "./page-transition"

export function SiteHeader({ english = false, path = "" }: { english?: boolean; path?: string }) {
  const home = english ? "/en" : "/"
  return <header className="portfolio-header sticky top-0">
    <PageTransitionLink href={home} className="portfolio-name">{english ? "Minf" : "Minf"}<span> / Frontend Engineer</span></PageTransitionLink>
    <nav aria-label={english ? "Main navigation" : "主导航"}>
      <PageTransitionLink href={home}>{english ? "Collections" : "合集"}</PageTransitionLink>
      <PageTransitionLink href={`${english ? "/en" : ""}/resume`}>{english ? "Resume" : "简历"}</PageTransitionLink>
      <Link href={english ? path || "/" : `/en${path}`} hrefLang={english ? "zh-CN" : "en"} aria-label={english ? "切换到中文" : "Switch to English"}>{english ? "中文" : "EN"}</Link>
      <ThemeToggle english={english} />
    </nav>
  </header>
}
