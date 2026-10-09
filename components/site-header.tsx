import Link from "next/link"

export function SiteHeader({ english = false, path = "" }: { english?: boolean; path?: string }) {
  const home = english ? "/en" : "/"
  return <header className="portfolio-header">
    <Link href={home} className="portfolio-name">{english ? "Yuquan Xu" : "胥昱全"}<span> / Frontend Engineer</span></Link>
    <nav aria-label={english ? "Main navigation" : "主导航"}>
      <Link href={home}>{english ? "Work" : "作品"}</Link>
      <Link href={`${english ? "/en" : ""}/resume`}>{english ? "Resume" : "简历"}</Link>
      <Link href={english ? path || "/" : `/en${path}`} hrefLang={english ? "zh-CN" : "en"} aria-label={english ? "切换到中文" : "Switch to English"}>{english ? "中文" : "EN"}</Link>
    </nav>
  </header>
}
