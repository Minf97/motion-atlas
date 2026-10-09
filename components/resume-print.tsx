"use client"

import { Printer } from "lucide-react"

export function ResumePrint({ english }: { english: boolean }) {
  return <button className="resume-print" onClick={() => window.print()} aria-label={english ? "Print or save as PDF" : "打印或另存为 PDF"} title={english ? "Print / Save PDF" : "打印 / 保存 PDF"}><Printer aria-hidden="true" /></button>
}
