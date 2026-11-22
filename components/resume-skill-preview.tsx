"use client"

import { useState, type CSSProperties } from "react"
import Link from "next/link"
import { ArrowUpRight, ZoomIn, ZoomOut } from "lucide-react"
import { skillPreviews, skillSources, type ResumeProductSkill } from "@/lib/resume-skills"
import { previewNotes } from "@/lib/resume-preview-notes"

// 就地预览真实界面
export function ResumeSkillPreview({ skill, english }: { skill: ResumeProductSkill; english: boolean }) {
  const [zoomed, setZoomed] = useState(false)
  const [selectedPreview, setSelectedPreview] = useState(skill.preview)
  const locale = english ? "en" : "zh"
  const source = skillSources[skill.source]
  const preview = skillPreviews[selectedPreview]
  const note = previewNotes[selectedPreview]
  const external = source.url.startsWith("https:")
  const href = !external && english ? `/en${source.url}` : source.url
  const style = { "--preview-ratio": note.width / note.height, "--focus-x": `${note.x}%`, "--focus-y": `${note.y}%` } as CSSProperties

  return <div className="resume-skill-source">
    <div className="resume-skill-source-heading">
      {external ? <a href={href} target="_blank" rel="noopener noreferrer">{english ? "Open page" : "查看原页"}<ArrowUpRight aria-hidden="true" /></a>
        : <Link href={href}>{english ? "Open work" : "查看作品"}<ArrowUpRight aria-hidden="true" /></Link>}
    </div>
    <figure className="resume-skill-preview">
      <button type="button" className="resume-preview-viewport" style={style} data-zoomed={zoomed} aria-pressed={zoomed}
        aria-label={english ? (zoomed ? "Reset product preview" : "Zoom product preview") : (zoomed ? "还原产品预览" : "放大产品预览")}
        onClick={() => setZoomed(value => !value)}>
        <span className="resume-preview-shot">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${preview.image}`} alt={preview.label[locale]} width={note.width} height={note.height} decoding="async" />
          <span className="resume-preview-marker" aria-hidden="true">01</span>
        </span>
        <span className="resume-preview-zoom" aria-hidden="true">{zoomed ? <ZoomOut /> : <ZoomIn />}</span>
      </button>
      <figcaption><span aria-hidden="true">01</span><div><strong>{preview.label[locale]}</strong><p>{note.detail[locale]}</p></div></figcaption>
    </figure>
    {skill.gallery && <div className="resume-preview-gallery" role="group" aria-label={english ? "Product screenshots" : "产品截图"}>
      {[skill.preview, ...skill.gallery].map(key => <button type="button" key={key} aria-pressed={selectedPreview === key}
        aria-label={`${english ? "Preview" : "预览"}：${skillPreviews[key].label[locale]}`} onClick={() => {
          setSelectedPreview(key)
          setZoomed(false)
        }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${skillPreviews[key].image}`} alt="" width={88} height={48} decoding="async" />
        <span>{skillPreviews[key].label[locale]}</span>
      </button>)}
    </div>}
    {skill.details && <ol className="resume-preview-details" start={2}>{skill.details.map((item, index) => <li key={item.title.en}>
      <span aria-hidden="true">{String(index + 2).padStart(2, "0")}</span><div><strong>{item.title[locale]}</strong><p>{item.detail[locale]}</p></div>
    </li>)}</ol>}
    <p className="resume-preview-provenance">{note.provenance ? note.provenance[locale] : (english ? "Website capture · 2026-11-21 · Click image to zoom" : "官网区域截图 · 2026.11.21 · 点击图片放大")}</p>
  </div>
}
