import { ArrowUpRight } from "lucide-react"
import type { AgentSource } from "@/lib/agent"

export function AgentSources({ sources, english }: { sources: AgentSource[]; english: boolean }) {
  if (!sources.length) return null
  return <div className="agent-citations"><span>{english ? "Sources" : "引用来源"}</span><div>{sources.map(source => <details key={source.id + source.url}><summary><span>[{source.id}] {source.title}</span></summary><p>{source.excerpt}</p><a href={source.url} target="_blank" rel="noreferrer">{english ? "Open source" : "打开来源"}<ArrowUpRight /></a></details>)}</div></div>
}
