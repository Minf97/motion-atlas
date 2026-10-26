import { useState } from "react"
import { Database, ExternalLink, Search, Settings, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import { filterKnowledge, conversationHistory, type AgentSection } from "@/lib/agent-workspace"
import { splitAgentEvents } from "@/lib/agent"
import { agentApiUrl, type AgentController } from "./use-agent"
import { ToolHistory } from "./tool-history"
import { LoopPanel } from "./loop"

export function AgentPanels({ section, agent, english }: { section: AgentSection; agent: AgentController; english: boolean }) {
  const [query, setQuery] = useState("")
  const knowledge = agent.workspace?.knowledge ?? []
  if (section === "Loop") return <LoopPanel agent={agent} english={english} />
  if (section === "Tool") return <>
    <div className="agent-panel-intro"><Wrench /><h2>{english ? "Tool registry" : "工具注册表"}</h2><p>{english ? "The model selects tools. The server executes them and returns evidence." : "模型选择工具，服务端执行调用，再将证据送回模型。"}</p></div>
    {agent.workspace?.tools.map(tool => <details key={tool.name} className="agent-registry-item"><summary><div><strong>{tool.name}</strong><span>{tool.name === "web_search" ? (english ? "External facts · Tavily" : "外部事实 · Tavily") : (english ? "Reviewed knowledge · TF-IDF" : "已审核资料 · TF-IDF")}</span></div><span className="agent-config-status" data-ready={tool.configured}>{tool.configured ? (english ? "Ready" : "可用") : (english ? "Not configured" : "未配置")}</span></summary><p>{tool.description}</p><pre>{JSON.stringify(tool.parameters, null, 2)}</pre></details>)}
    <div className="agent-section-bar agent-spaced"><h2>{english ? "Call history" : "调用历史"}</h2><span>{english ? "This session" : "当前会话"}</span></div><ToolHistory turns={agent.turns} english={english} />
  </>
  if (section === "Memory") return <>
    <div className="agent-panel-intro"><h2>{english ? "Working memory" : "工作记忆"}</h2><p>{english ? "Up to 20 recent completed messages are passed to the next turn. This session is held in browser memory." : "最近最多 20 条已完成消息会传入下一轮。本次会话保存在浏览器运行内存中。"}</p></div>
    <div className="agent-memory-summary"><div><strong>{conversationHistory(agent.turns).length}</strong><span>{english ? "context messages" : "上下文消息"}</span></div><div><strong>{knowledge.length}</strong><span>{english ? "reviewed knowledge chunks" : "已审核知识片段"}</span></div></div>
    <div className="agent-section-bar"><h2>{english ? "Conversation context" : "对话上下文"}</h2><span>{english ? "Session only" : "仅当前会话"}</span></div>
    {agent.turns.length ? <div className="agent-memory-messages">{agent.turns.map((turn, index) => <details key={turn.id}><summary><span>{String(index + 1).padStart(2, "0")}</span><strong>{turn.question}</strong><small>{turn.status}</small></summary><div className="agent-memory-answer"><label>assistant</label><p>{splitAgentEvents(turn.events).answer || turn.error || (english ? "No completed answer." : "尚无完整回答。")}</p></div></details>)}</div> : <p className="agent-panel-empty">{english ? "Your first conversation will appear here." : "第一次对话后，这里会显示上下文。"}</p>}
    <div className="agent-memory-note"><h3>{english ? "Reviewed knowledge" : "已审核个人知识"}</h3><p>{english ? "Public résumé and project documents are the durable knowledge source. Visitors cannot write personal facts into it. Chats are not stored on the server." : "公开简历和项目文档作为长期知识来源，访客不能写入个人事实。对话不会保存在服务端。"}</p></div>
  </>
  if (section === "Database") {
    const filtered = filterKnowledge(knowledge, query)
    return <>
      <div className="agent-panel-intro"><Database /><h2>{english ? "Knowledge store" : "知识存储"}</h2><p>{english ? "Browse the exact document chunks indexed by the backend." : "查看后端实际索引的原文片段。"}</p></div>
      <dl className="agent-properties"><div><dt>{english ? "Documents" : "文档存储"}</dt><dd>{agent.workspace?.storage.documents ?? "—"}</dd></div><div><dt>{english ? "Retrieval index" : "检索索引"}</dt><dd>{agent.workspace?.storage.index ?? "—"}</dd></div><div><dt>{english ? "Chunks" : "原文片段"}</dt><dd>{knowledge.length}</dd></div></dl>
      <label className="agent-knowledge-search"><Search /><input value={query} onChange={event => setQuery(event.target.value)} placeholder={english ? "Filter documents…" : "筛选文档和原文…"} aria-label={english ? "Filter knowledge" : "筛选知识"} /><span>{filtered.length}</span></label>
      <div className="agent-document-list">{filtered.map(chunk => <article key={chunk.id}><header><span>#{String(chunk.id).padStart(2, "0")} · {chunk.kind}</span><a href={chunk.url} target="_blank" rel="noreferrer" aria-label={english ? "Open source " + chunk.title : "打开来源 " + chunk.title}><ExternalLink /></a></header><h3>{chunk.title}</h3><p>{chunk.text}</p></article>)}</div>
      {filtered.length === 0 && <p className="agent-panel-empty">{english ? "No matching documents." : "没有匹配的文档。"}</p>}
    </>
  }
  if (section === "Settings") return <>
    <div className="agent-panel-intro"><Settings /><h2>{english ? "Runtime settings" : "运行设置"}</h2><p>{english ? "Choose a provider. Credentials and tool configuration are managed on the server." : "选择当前模型。密钥和工具配置由服务端管理。"}</p></div>
    <div className="agent-setting-row"><div><h3>{english ? "Conversation model" : "对话模型"}</h3><p>{english ? "Applied to the next request and evaluation." : "用于下一次请求和评测。"}</p></div><select aria-label={english ? "Settings model" : "设置模型"} value={agent.model} disabled={agent.loading || agent.evaluating} onChange={event => agent.setModel(event.target.value as "openai" | "deepseek")}><option value="deepseek">DeepSeek</option><option value="openai">OpenAI</option></select></div>
    <div className="agent-section-bar agent-spaced"><h2>{english ? "Provider configuration" : "服务端模型配置"}</h2><span>{english ? "Read only" : "只读"}</span></div>
    {agent.workspace?.models.map(model => <article className="agent-provider" key={model.id}><header><strong>{model.id === "openai" ? "OpenAI" : "DeepSeek"}</strong><span className="agent-config-status" data-ready={model.configured}>{model.configured ? (english ? "Key configured" : "已配置密钥") : (english ? "Key missing" : "未配置密钥")}</span></header><dl className="agent-properties"><div><dt>Model</dt><dd>{model.name}</dd></div><div><dt>Host</dt><dd>{model.host}</dd></div></dl></article>)}
    <dl className="agent-properties agent-spaced"><div><dt>Agent API</dt><dd>{agentApiUrl || (english ? "Not configured" : "未配置")}</dd></div><div><dt>{english ? "Maximum tool rounds" : "最大工具轮次"}</dt><dd>{agent.workspace?.max_steps ?? "—"}</dd></div><div><dt>{english ? "Persistent chat" : "持久化对话"}</dt><dd>{english ? "Not enabled" : "未启用"}</dd></div></dl>
    <Button variant="outline" size="sm" onClick={() => void agent.connect()}>{english ? "Refresh service status" : "刷新服务状态"}</Button>
  </>
  return null
}
