import Link from "next/link"
import { ArrowUpRight, ChevronDown } from "lucide-react"
import * as zh from "@/lib/resume"
import * as en from "@/lib/resume-en"
import { ResumePrint } from "@/components/resume-print"
import { SiteHeader } from "@/components/site-header"

// 中英共用排版
export function ResumeView({ english = false }: { english?: boolean }) {
  const { profile, experience, projects } = english ? en : zh
  return <main className="resume-page" lang={english ? "en" : "zh-CN"} id="top">
    <SiteHeader english={english} path="/resume" />
    <ResumePrint english={english} />
    <div className="resume-content">
      <div className="resume-heading"><h1>{profile.name}</h1><p>{profile.role} · {profile.location}</p></div>
      <p className="resume-summary">{profile.summary}</p>
      <div className="resume-links"><a href={`mailto:${profile.email}`}>{profile.email} <ArrowUpRight aria-hidden="true" /></a><a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight aria-hidden="true" /></a><a href={profile.blog} target="_blank" rel="noopener noreferrer">{english ? "Blog" : "技术博客"} <ArrowUpRight aria-hidden="true" /></a></div>
      <section className="resume-section" aria-labelledby="experience-title"><h2 id="experience-title">{english ? "Work Experience" : "工作经历"}</h2>
        {experience.map(item => <article className="resume-entry" key={item.company}><div className="resume-entry-title"><h3>{item.company}</h3><time>{item.date}</time></div><p className="resume-role">{item.role} · {item.location}</p><ul>{item.details.map(detail => <li key={detail}>{detail}</li>)}</ul></article>)}
      </section>
      <section className="resume-section" aria-labelledby="projects-title"><h2 id="projects-title">{english ? "Projects" : "项目经历"}</h2>
        {projects.map(item => <article className="resume-entry" key={item.name}><div className="resume-entry-title"><h3>{item.name}</h3><time>{item.date}</time></div><p className="resume-role">{item.role}</p><details className="resume-details"><summary>{english ? "Details" : "详情"}<ChevronDown aria-hidden="true" /></summary><ul>{item.details.map(detail => <li key={detail}>{detail}</li>)}</ul></details></article>)}
      </section>
      <section className="resume-section resume-skills" aria-labelledby="skills-title"><h2 id="skills-title">{english ? "Skills" : "技术能力"}</h2>
        {profile.skills.map(skill => <div className="resume-skill" key={skill.title}><h3>{skill.title}</h3><p>{skill.items}</p></div>)}
      </section>
    </div>
    <footer className="portfolio-footer"><span>{profile.name} · {profile.role}</span><Link href={english ? "/en" : "/"}>{english ? "View work" : "查看作品"} <ArrowUpRight aria-hidden="true" /></Link><a href="#top">{english ? "Back to top ↑" : "返回顶部 ↑"}</a></footer>
  </main>
}
