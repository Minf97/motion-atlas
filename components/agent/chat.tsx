import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react"
import { ArrowUp, Check, ChevronDown, Copy, LoaderCircle, MessageSquare, Square, Wrench } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { recommendedQuestions, recommendedQuestionsEn, splitAgentEvents, type AgentTurn } from "@/lib/agent"
import { toolCalls } from "@/lib/agent-workspace"
import type { AgentController } from "./use-agent"
import { AgentSources } from "./sources"
import { ToolHistory } from "./tool-history"

function ChatTurn({ turn, english, onInspect }: { turn: AgentTurn; english: boolean; onInspect: (id: string) => void }) {
  const { answer, sources } = splitAgentEvents(turn.events)
  const calls = toolCalls(turn.events)
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState("")
  const latestStage = turn.events.filter(event => event.type === "stage").at(-1)
  async function copyAnswer() {
    try {
      await navigator.clipboard.writeText(answer)
      setCopied(true)
    } catch (error) {
      setCopyError(error instanceof Error ? error.message : String(error))
    }
  }
  return <article className="agent-chat-turn" data-status={turn.status}>
    <div className="agent-chat-user"><p>{turn.question}</p></div>
    <div className="agent-chat-assistant">
      <div className="agent-assistant-label"><span>Minf Agent</span><small>{turn.model === "openai" ? "OpenAI" : "DeepSeek"}</small></div>
      {turn.events.length > 0 && <details className="agent-chat-process"><summary>{turn.status === "running" ? <LoaderCircle className="agent-spin" /> : <ChevronDown />}<span>{turn.status === "running" ? (latestStage?.stage ?? (english ? "Connecting" : "正在连接")) : (english ? "Execution process" : "执行过程")}</span><small>{calls.length} {english ? "tool calls" : "次工具调用"}</small></summary><div>
        {turn.events.filter(event => event.type === "plan").map((event, index) => <p className="agent-plan-summary" key={index}>{english ? "Selected tools: " : "选定工具："}{event.content}</p>)}
        {calls.length > 0 && <ToolHistory turns={[turn]} english={english} />}
        <button className="agent-text-link" onClick={() => onInspect(turn.id)}>{english ? "View architecture & trace" : "查看架构与运行轨迹"}</button>
      </div></details>}
      {answer && <div className="agent-markdown"><ReactMarkdown remarkPlugins={[remarkGfm]} components={{ a: ({ children, href }) => <a href={href} target="_blank" rel="noreferrer">{children}</a> }}>{answer}</ReactMarkdown></div>}
      {turn.status === "running" && !answer && <p className="agent-chat-pending"><span />{english ? "Working on your request…" : "正在处理你的问题…"}</p>}
      {turn.status === "error" && <div className="agent-chat-error" role="alert"><strong>{english ? "Request failed" : "请求失败"}</strong><p>{turn.error}</p></div>}
      {turn.status === "cancelled" && <p className="agent-chat-pending">{english ? "Stopped by you." : "已停止本次请求。"}</p>}
      <AgentSources sources={sources} english={english} />
      {turn.status === "completed" && <div className="agent-answer-actions"><Button variant="ghost" size="icon-xs" onClick={() => void copyAnswer()} aria-label={english ? "Copy answer" : "复制回答"}>{copied ? <Check /> : <Copy />}</Button><span>{(turn.duration_ms / 1000).toFixed(1)}s</span><button onClick={() => onInspect(turn.id)}>{english ? "Inspect" : "查看链路"}</button></div>}
      {copyError && <p className="agent-error-text" role="alert">{copyError}</p>}
    </div>
  </article>
}

// 连接对话和工具记录
export function AgentChat({ agent, english, onInspect, hidden = false }: { agent: AgentController; english: boolean; onInspect: (id: string) => void; hidden?: boolean }) {
  const [question, setQuestion] = useState("")
  const [tab, setTab] = useState<"chat" | "tools">("chat")
  const scroll = useRef<HTMLDivElement>(null)
  const follow = useRef(true)
  const input = useRef<HTMLTextAreaElement>(null)
  const questions = english ? recommendedQuestionsEn : recommendedQuestions
  const totalCalls = agent.turns.reduce((sum, turn) => sum + toolCalls(turn.events).length, 0)
  useEffect(() => {
    if (follow.current && scroll.current) scroll.current.scrollTop = scroll.current.scrollHeight
  }, [agent.turns, tab])

  // 发送当前输入
  function submit(event: FormEvent) {
    event.preventDefault()
    if (!question.trim() || agent.loading || agent.evaluating) return
    const value = question
    setQuestion("")
    setTab("chat")
    follow.current = true
    void agent.send(value)
  }
  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault()
      event.currentTarget.form?.requestSubmit()
    }
  }

  return <aside hidden={hidden} className="agent-chat-panel" aria-label={english ? "Agent chat" : "Agent 对话"}>
    <header className="agent-chat-header"><div role="tablist" aria-label={english ? "Chat views" : "对话视图"}><button role="tab" aria-selected={tab === "chat"} aria-controls="agent-chat-content" onClick={() => setTab("chat")} className={cn(tab === "chat" && "is-active")}><MessageSquare />Chat</button><button role="tab" aria-selected={tab === "tools"} aria-controls="agent-chat-content" onClick={() => setTab("tools")} className={cn(tab === "tools" && "is-active")}><Wrench />{english ? "Tool history" : "工具历史"}<small>{totalCalls}</small></button></div></header>
    <div id="agent-chat-content" className="agent-chat-log" ref={scroll} role="tabpanel" aria-live="polite" onScroll={() => { if (scroll.current) follow.current = scroll.current.scrollHeight - scroll.current.scrollTop - scroll.current.clientHeight < 64 }}>
      {tab === "tools" ? <ToolHistory turns={agent.turns} english={english} onInspect={onInspect} /> : agent.turns.length > 0 ? agent.turns.map(turn => <ChatTurn key={turn.id} turn={turn} english={english} onInspect={onInspect} />) : <div className="agent-chat-welcome"><div className="agent-welcome-brand">Minf</div><h2>{english ? "Where shall we start?" : "从哪里开始？"}</h2><p>{english ? "My work, my projects, or a question that needs research." : "聊聊我的经历、项目，或查找一个有来源的答案。"}</p><div className="agent-suggested-questions">{[questions[0], questions[1], questions[5]].map((question, index) => <button key={question} onClick={() => { setQuestion(question); input.current?.focus() }}><span>{[english ? "Agent projects" : "Agent 项目", "Pacagen", english ? "Web research" : "网页研究"][index]}</span>{question}<ArrowUp /></button>)}</div></div>}
    </div>
    <form className="agent-chat-composer" onSubmit={submit}>
      <label className="sr-only" htmlFor="agent-question">{english ? "Question" : "问题"}</label>
      <textarea id="agent-question" ref={input} value={question} onChange={event => setQuestion(event.target.value)} onKeyDown={onKeyDown} placeholder={english ? "Message Minf Agent…" : "向 Minf Agent 提问…"} maxLength={1000} rows={3} />
      <div className="agent-composer-tools"><span><Wrench />{english ? "Read-only tools" : "只读工具"}</span><select value={agent.model} onChange={event => agent.setModel(event.target.value as "openai" | "deepseek")} disabled={agent.loading || agent.evaluating} aria-label={english ? "Chat model" : "对话模型"}><option value="deepseek">DeepSeek</option><option value="openai">OpenAI</option></select>{agent.loading ? <Button size="icon-sm" onClick={agent.stop} type="button" aria-label={english ? "Stop generation" : "停止生成"}><Square /></Button> : <Button size="icon-sm" type="submit" disabled={!question.trim() || agent.evaluating} aria-label={english ? "Send question" : "发送问题"}><ArrowUp /></Button>}</div>
    </form>
    <p className="agent-chat-footnote">{english ? "Enter to send · Steps are auditable summaries" : "Enter 发送 · 仅展示可审计步骤摘要"}</p>
  </aside>
}
