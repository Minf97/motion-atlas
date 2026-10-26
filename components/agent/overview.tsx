import { useState } from "react"
import { ArrowRight, CornerDownRight, Radio, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import { splitAgentEvents, type AgentStage } from "@/lib/agent"
import { stageStates, toolCalls, type AgentSection } from "@/lib/agent-workspace"
import { Architecture, stageInfo } from "./architecture"
import type { AgentController } from "./use-agent"
import { AgentSources } from "./sources"

// 展示链路和节点详情
export function AgentOverview({ agent, english, onNavigate }: { agent: AgentController; english: boolean; onNavigate: (section: AgentSection) => void }) {
  const [selection, setSelection] = useState<AgentStage | null>(null)
  const states = stageStates(agent.active)
  const running = Object.entries(states).find(([, status]) => status === "running")?.[0] as AgentStage | undefined
  const selected = selection ?? running ?? (agent.active?.status === "completed" ? "answer" : "context")
  const info = stageInfo[selected]
  const events = agent.active?.events.filter(event => event.stage === selected) ?? []
  const { sources } = splitAgentEvents(agent.active?.events ?? [])
  const calls = toolCalls(agent.active?.events ?? [])
  const status = agent.active?.status ?? "idle"
  const statusLabel = status === "running" ? (running ? stageInfo[running].title : "Connecting") : status === "completed" ? "Completed" : status === "error" ? "Failed" : status === "cancelled" ? "Cancelled" : "Idle"

  return <>
    <div className="agent-stat-row">
      <div><span>{english ? "Session turns" : "会话轮次"}</span><strong>{agent.turns.length}<small>{english ? "turns" : "轮"}</small></strong></div>
      <div><span>{english ? "Tool calls" : "本轮工具调用"}</span><strong>{calls.length}<small>{english ? "calls" : "次"}</small></strong></div>
      <div><span>{english ? "Evidence" : "本轮证据"}</span><strong>{sources.length}<small>{english ? "sources" : "条来源"}</small></strong></div>
      <div><span>{english ? "Elapsed" : "本轮耗时"}</span><strong>{agent.active ? (agent.active.duration_ms / 1000).toFixed(1) : "—"}<small>s</small></strong></div>
    </div>
    <section className="agent-architecture-panel">
      <div className="agent-section-bar"><h2>Architecture <small>{english ? "Click any box" : "点击任意节点"}</small></h2><span className="agent-run-status" data-status={status}><i />{statusLabel}</span></div>
      <Architecture turn={agent.active} selected={selected} onSelect={setSelection} english={english} />
      <div className="agent-diagram-footer"><div><span><i data-status="running" />{english ? "Running" : "执行中"}</span><span><i data-status="completed" />{english ? "Completed" : "已完成"}</span><span><i data-status="pending" />{english ? "Not visited" : "尚未经过"}</span></div><span>LangGraph · ReAct</span></div>
    </section>
    <section className="agent-node-inspector">
      <div className="agent-section-bar"><h2><CornerDownRight />{info.title}<small>{english ? info.en : info.zh}</small></h2>{selection && <Button variant="ghost" size="sm" onClick={() => setSelection(null)}><Radio />{english ? "Follow live" : "跟随当前阶段"}</Button>}</div>
      {selected === "input" && agent.active ? <p className="agent-inspector-text">{agent.active.question}</p> : selected === "context" ? <p className="agent-inspector-text">{english ? "Recent completed messages are supplied to the model. Personal facts are retrieved from reviewed documents by the knowledge tool." : "最近完成的对话作为上下文传入模型。个人事实由知识检索工具从已审核文档中获取。"}</p> : events.length > 0 ? <div className="agent-inspector-events">{events.map((event, index) => <div key={index}><span>{event.type === "stage" ? event.status : event.type}</span><p>{event.content}{event.query && <code>{event.query}</code>}</p><small>{event.elapsed_ms ?? 0} ms</small></div>)}</div> : <p className="agent-panel-empty">{english ? "This node has no events in the selected turn. Send a message to watch the real execution." : "所选轮次还没有这个节点的事件。发送消息后可观察实际链路。"}</p>}
      {(selected === "observe" || selected === "answer" || selected === "tools") && sources.length > 0 && <AgentSources sources={sources} english={english} />}
      <button className="agent-text-link" onClick={() => onNavigate(selected === "context" ? "Memory" : selected === "tools" ? "Tool" : "Loop")}>{english ? "Explore this component" : "查看组件详情"}<ArrowRight /></button>
    </section>
    <div className="agent-capabilities"><div><Wrench /><h2>{english ? "Available tools" : "工具能力"}</h2><span>{agent.workspace?.tools.length ?? "—"}</span></div>{agent.workspace?.tools.map(tool => <button key={tool.name} onClick={() => onNavigate("Tool")}><strong>{tool.name === "web_search" ? "Web search" : "Personal knowledge"}</strong><span data-ready={tool.configured}>{tool.configured ? (english ? "Ready" : "可用") : (english ? "Not configured" : "未配置")}</span><ArrowRight /></button>)}</div>
  </>
}
