"use client"

import { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"
import { Popover } from "radix-ui"
import { skillSources, type ResumeProductSkill, type ResumeTextSkill, type ResumeSkillGroup } from "@/lib/resume-skills"
import { ResumeSkillPreview } from "@/components/resume-skill-preview"

function SkillTag({ skill, english, side }: { skill: ResumeProductSkill | ResumeTextSkill; english: boolean; side: "right" | "top" }) {
  const [open, setOpen] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const content = useRef<HTMLDivElement>(null)
  const locale = english ? "en" : "zh"
  useEffect(() => () => clearTimeout(timer.current), [])

  // 跨越间隙保持展开
  function keepOpen() {
    clearTimeout(timer.current)
    setOpen(true)
  }

  // 短暂停留再展开
  function openLater() {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setOpen(true), 260)
  }

  function closeLater() {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setOpen(false), 180)
  }

  return <li className="resume-skill-item"><Popover.Root open={open} onOpenChange={value => {
    clearTimeout(timer.current)
    setOpen(value)
  }}>
    <Popover.Trigger className="resume-skill-trigger" onClick={event => {
      event.preventDefault()
      keepOpen()
    }} onPointerEnter={event => {
      if (event.pointerType === "mouse") openLater()
    }} onPointerLeave={event => { if (event.pointerType === "mouse") closeLater() }} onFocus={event => {
      if (event.currentTarget.matches(":focus-visible")) keepOpen()
    }} onBlur={event => {
      if (!content.current?.contains(event.relatedTarget)) closeLater()
    }}>{skill.term}</Popover.Trigger>
    <Popover.Portal>
      <Popover.Content ref={content} className="resume-skill-card" side={side} align="start" sideOffset={12} collisionPadding={16}
        aria-label={`${skill.term} · ${english ? "Project experience" : "项目经历"}`} lang={english ? "en" : "zh-CN"}
        onOpenAutoFocus={event => event.preventDefault()} onCloseAutoFocus={event => event.preventDefault()}
        onPointerEnter={keepOpen} onPointerLeave={event => { if (event.pointerType === "mouse") closeLater() }} onFocusCapture={keepOpen}
        onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) closeLater() }}>
        <div className="resume-skill-card-top"><span>{skill.project}</span><Popover.Close aria-label={english ? "Close experience" : "关闭经历"}><X aria-hidden="true" /></Popover.Close></div>
        <h4>{skill.term}</h4>
        <p className="resume-skill-meaning">{skill.meaning[locale]}</p>
        <p className="resume-skill-experience">{skill.experience[locale]}</p>
        {skill.preview ? <ResumeSkillPreview skill={skill} english={english} /> : <div className="resume-skill-text-details">
          {skill.source && <a href={skillSources[skill.source].url} target="_blank" rel="noopener noreferrer">{english ? "Open related page ↗" : "查看相关页面 ↗"}</a>}
          {skill.details && <ol className="resume-preview-details" start={1}>{skill.details.map((item, index) => <li key={item.title.en}>
            <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><div><strong>{item.title[locale]}</strong><p>{item.detail[locale]}</p></div>
          </li>)}</ol>}
        </div>}
        {/* 对齐展开原点 */}
        <Popover.Arrow width={12} height={6} style={{ visibility: "hidden" }} />
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root></li>
}

// 六类技能共用交互
export function ResumeSkills({ groups, english = false }: { groups: ResumeSkillGroup[]; english?: boolean }) {
  const [wide, setWide] = useState(false)
  // 窄屏改为上下展开
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)")
    const update = () => setWide(media.matches)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  return <section className="resume-section resume-skills" aria-labelledby="skills-title">
    <h2 id="skills-title">{english ? "Skills" : "技能"}</h2>
    {groups.map(group => <section className="resume-skill-group" key={group.id} aria-labelledby={`skill-group-${group.id}`}>
      <h3 id={`skill-group-${group.id}`}>{english ? group.titleEn : group.title}</h3>
      <ul className="resume-skill-tags">{group.items.map(skill => skill.note
        ? <li className="resume-skill-item" key={skill.id}>
          <button className="resume-skill-trigger" data-cursor="block" data-voice={skill.note[english ? "en" : "zh"]} aria-describedby={`skill-note-${skill.id}`}>{skill.term}</button>
          <span className="sr-only" id={`skill-note-${skill.id}`}>{skill.note[english ? "en" : "zh"]}</span>
        </li>
        : <SkillTag key={skill.id} skill={skill} english={english} side={wide ? "right" : "top"} />)}</ul>
    </section>)}
  </section>
}
