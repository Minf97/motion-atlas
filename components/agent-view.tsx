"use client"

import { useState } from "react"
import { Brain, CirclePlus, Database, LayoutDashboard, PanelLeftClose, PanelLeftOpen, Settings, Workflow, Wrench } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { agentSections, type AgentSection } from "@/lib/agent-workspace"
import { useAgent } from "@/components/agent/use-agent"
import { AgentOverview } from "@/components/agent/overview"
import { AgentPanels } from "@/components/agent/panels"
import { AgentChat } from "@/components/agent/chat"

const icons = { Overview: LayoutDashboard, Loop: Workflow, Memory: Brain, Tool: Wrench, Database, Settings }

// 三栏同时展示运行态
export function AgentView({ english = false }: { english?: boolean }) {
  const agent = useAgent(english)
  const [section, setSection] = useState<AgentSection>("Overview")
  const [collapsed, setCollapsed] = useState(false)
  const [mobilePane, setMobilePane] = useState<"workspace" | "chat">("workspace")
  const inspect = (id: string) => { agent.setActiveId(id); setSection("Overview"); setMobilePane("workspace") }
  const sectionLabel = (item: AgentSection) => item === "Overview" ? (english ? "Overview" : "总览") : item === "Loop" ? "Loop" : item === "Memory" ? (english ? "Memory" : "记忆") : item === "Tool" ? (english ? "Tool" : "工具") : item === "Database" ? (english ? "Database" : "数据库") : (english ? "Settings" : "设置")

  return <main className={cn("agent-page", collapsed && "rail-collapsed")} lang={english ? "en" : "zh-CN"}>
    <div className="agent-site-header"><SiteHeader english={english} path="/agent" /></div>
    <div className="agent-layout" data-mobile-pane={mobilePane}>
      <aside className="agent-rail" aria-label={english ? "Agent navigation" : "Agent 导航"}>
        <div className="agent-rail-brand"><span>Minf <small>Agent</small></span><Button variant="ghost" size="icon-sm" onClick={() => setCollapsed(!collapsed)} aria-label={english ? "Toggle sidebar" : "展开或收起侧栏"}>{collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}</Button></div>
        <Button variant="outline" className="agent-new-chat" onClick={agent.newChat} disabled={agent.loading || agent.evaluating}><CirclePlus /><span>{english ? "New chat" : "新对话"}</span></Button>
        <div className="agent-rail-caption">{english ? "WORKSPACE" : "工作区"}</div>
        <nav className="agent-section-nav">{agentSections.map(item => {
          const Icon = icons[item]
          return <button key={item} className={cn(section === item && "is-active")} onClick={() => { setSection(item); setMobilePane("workspace") }} aria-current={section === item ? "page" : undefined} title={sectionLabel(item)}><Icon /><span>{sectionLabel(item)}</span>{item === "Tool" && agent.workspace && <small>{agent.workspace.tools.length}</small>}</button>
        })}</nav>
        <div className="agent-rail-footer"><div className="agent-backend-status" data-status={agent.connection}><i /><span>{agent.connection === "connected" ? (english ? "API connected" : "API 已连接") : agent.connection === "connecting" ? (english ? "Connecting…" : "正在连接…") : (english ? "API unavailable" : "API 未连接")}</span></div></div>
      </aside>
      <div className="agent-mobile-switch" role="group" aria-label={english ? "Visible panel" : "显示面板"}><button aria-pressed={mobilePane === "workspace"} onClick={() => setMobilePane("workspace")}>{english ? "Workspace" : "工作区"}</button><button aria-pressed={mobilePane === "chat"} onClick={() => setMobilePane("chat")}>Chat {agent.loading && "•"}</button></div>
      <section className="agent-center" aria-label={english ? "Agent workspace" : "Agent 工作区"}>
        <header className="agent-pane-heading"><span>{sectionLabel(section)}</span><span className="agent-session-label">{english ? "Current run" : "当前运行"}</span></header>
        <div className="agent-center-scroll">
          <div className="agent-section-heading"><h1>{sectionLabel(section)}</h1><p>{english ? "Watch the agent move from request to evidence and answer." : "实时查看 Agent 如何从请求走到工具、证据与回答。"}</p></div>
          {agent.connection === "error" && <div className="agent-connection-alert" role="alert"><div><strong>{english ? "Cannot connect to the backend" : "无法连接后端"}</strong><p>{agent.connectionError}</p></div><Button variant="outline" size="sm" onClick={() => void agent.connect()}>{english ? "Retry" : "重试"}</Button></div>}
          {section === "Overview" ? <AgentOverview agent={agent} english={english} onNavigate={setSection} /> : <AgentPanels section={section} agent={agent} english={english} />}
        </div>
      </section>
      <AgentChat agent={agent} english={english} onInspect={inspect} />
    </div>
  </main>
}
