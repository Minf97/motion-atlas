import Link from "next/link"
import { ArrowUpRight, ChevronDown } from "lucide-react"
import * as zh from "@/lib/resume"
import * as en from "@/lib/resume-en"
import { ResumeCursor } from "@/components/resume-cursor"
import { ResumePrint } from "@/components/resume-print"
import { SiteHeader } from "@/components/site-header"

// 中英共用排版
export function ResumeView({ english = false }: { english?: boolean }) {
  const { profile, experience, projects, personal, education } = english ? en : zh
  return <main className="resume-page" lang={english ? "en" : "zh-CN"} id="top">
    <SiteHeader english={english} path="/resume" />
    <ResumePrint english={english} />
    <ResumeCursor />
    <div className="resume-content">
      <div className="resume-heading"><h1 data-cursor="block" data-voice={english ? "You can call me Minf as well." : "也可以叫我 Minf。"}>{profile.name}</h1><p>{profile.role} · {profile.location}</p></div>
      <p className="resume-summary">{profile.summary}</p>
      <div className="resume-links"><a data-cursor="a" data-voice={english ? "Send me an email. Let’s talk." : "可以发邮件联系我。"} href={`mailto:${profile.email}`}>{profile.email} <ArrowUpRight aria-hidden="true" /></a><a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight aria-hidden="true" /></a><a href={profile.blog} target="_blank" rel="noopener noreferrer">{english ? "Blog" : "技术博客"} <ArrowUpRight aria-hidden="true" /></a></div>
      <section className="resume-section" aria-labelledby="personal-title">
        <h2 id="personal-title">{english ? "Personal Information" : "个人信息"}</h2>
        <dl className="resume-personal">
          <div><dt>Birthday:</dt><dd><span data-cursor="block" data-voice={english ? "Born in December 2000." : "出生于 2000 年 12 月。"}>{personal.birthday}</span></dd></div>
          <div><dt>MBTI:</dt><dd><span data-cursor="block" data-voice={english ? "Extraverted, sensing, thinking, and perceiving." : "外向、实感、思考、知觉。"}>{personal.mbti}</span></dd></div>
        </dl>
      </section>
      <section className="resume-section" aria-labelledby="experience-title"><h2 id="experience-title" data-cursor="block" data-voice={english ? "Frontend interfaces, interactions, and AI agents." : "我的工作围绕前端界面、交互和 AI Agent 展开。"}>{english ? "Work Experience" : "工作经历"}</h2>
        {experience.map(item => <article className="resume-entry" key={item.company}><div className="resume-entry-title"><h3 data-cursor="block" data-voice={item.details[0]}>{item.company}</h3><time data-cursor="block" data-voice={item.date}>{item.date}</time></div><p className="resume-role">{item.role} · {item.location}</p><ul>{item.details.map(detail => <li key={detail}>{detail}</li>)}</ul></article>)}
      </section>
      <section className="resume-section" aria-labelledby="education-title">
        <h2 id="education-title" data-cursor="block" data-voice={english ? "Education never really stops, right?" : "学习不会在毕业时结束。"}>{english ? "Education" : "教育经历"}</h2>
        <article className="resume-entry"><div className="resume-entry-title">
          <h3 data-cursor="block" data-voice={english ? "I studied at Guangdong University of Petrochemical Technology." : "我毕业于广东石油化工学院。"}>{education.school}</h3>
          <time data-cursor="block" data-voice={english ? "September 2019 to July 2023." : "2019 年 9 月入学，2023 年 7 月毕业。"}>{education.date}</time>
        </div></article>
      </section>
      <section className="resume-section" aria-labelledby="projects-title"><h2 id="projects-title">{english ? "Projects" : "项目经历"}</h2>
        {projects.map(item => <article className="resume-entry" key={item.name}><div className="resume-entry-title"><h3 data-cursor="block" data-voice={item.details[0]}>{item.name}</h3><time data-cursor="block" data-voice={item.date}>{item.date}</time></div><p className="resume-role">{item.role}</p><details className="resume-details"><summary data-cursor="block" data-voice={english ? "A closer look at this project." : "展开查看项目的详细经历。"}>{english ? "Details" : "详情"}<ChevronDown aria-hidden="true" /></summary><ul>{item.details.map(detail => <li key={detail}>{detail}</li>)}</ul></details></article>)}
      </section>
      <section className="resume-section resume-skills" aria-labelledby="skills-title"><h2 id="skills-title">{english ? "Skills" : "技术能力"}</h2>
        {profile.skills.map(skill => <div className="resume-skill" key={skill.title}><h3>{skill.title}</h3><p>{skill.items}</p></div>)}
      </section>
    </div>
    <footer className="portfolio-footer"><span>{profile.name} · {profile.role}</span><Link href={english ? "/en" : "/"}>{english ? "View work" : "查看作品"} <ArrowUpRight aria-hidden="true" /></Link><a href="#top">{english ? "Back to top ↑" : "返回顶部 ↑"}</a></footer>
  </main>
}
