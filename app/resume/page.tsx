import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { experience, profile, projects } from "@/lib/resume"

export const metadata: Metadata = {
  title: "简历 — 胥昱全",
  description: "胥昱全的前端 Agent 工程师简历，包含工作经历、项目与技术能力。",
}

export default function ResumePage() {
  return <main className="resume-page" id="top">
    <header className="portfolio-header"><Link href="/" className="portfolio-name">胥昱全<span> / Frontend Engineer</span></Link><nav aria-label="主导航"><Link href="/"><ArrowLeft aria-hidden="true" /> 返回作品</Link></nav></header>
    <div className="resume-content">
      <div className="resume-heading"><span>RESUME / 2026</span><h1>{profile.name}</h1><p>{profile.role} · {profile.location}</p></div>
      <p className="resume-summary">{profile.summary}</p>
      <div className="resume-links"><a href={`mailto:${profile.email}`}>{profile.email} <ArrowUpRight aria-hidden="true" /></a><a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight aria-hidden="true" /></a><a href={profile.blog} target="_blank" rel="noopener noreferrer">技术博客 <ArrowUpRight aria-hidden="true" /></a></div>

      <section className="resume-section" aria-labelledby="experience-title"><h2 id="experience-title">工作经历 <small>Experience</small></h2>
        {experience.map((item) => <article className="resume-entry" key={item.company}><div className="resume-entry-title"><h3>{item.company}</h3><time>{item.date}</time></div><p className="resume-role">{item.role} · {item.location}</p><ul>{item.details.map((detail) => <li key={detail}>{detail}</li>)}</ul></article>)}
      </section>

      <section className="resume-section" aria-labelledby="projects-title"><h2 id="projects-title">项目经历 <small>Projects</small></h2>
        {projects.map((item) => <article className="resume-entry" key={item.name}><div className="resume-entry-title"><h3>{item.name}</h3><time>{item.date}</time></div><p className="resume-role">{item.role}</p><ul>{item.details.map((detail) => <li key={detail}>{detail}</li>)}</ul></article>)}
      </section>

      <section className="resume-section resume-skills" aria-labelledby="skills-title"><h2 id="skills-title">技术能力 <small>Skills</small></h2>
        {profile.skills.map((skill) => <div className="resume-skill" key={skill.title}><h3>{skill.title}</h3><p>{skill.items}</p></div>)}
      </section>
    </div>
    <footer className="portfolio-footer"><span>胥昱全 · {profile.role}</span><Link href="/">查看作品 <ArrowUpRight aria-hidden="true" /></Link><a href="#top">返回顶部 ↑</a></footer>
  </main>
}
