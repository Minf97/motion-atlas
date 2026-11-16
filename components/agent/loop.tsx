import { Radio } from "lucide-react"
import { stageInfo } from "./architecture"
import type { AgentController } from "./use-agent"

export function LoopPanel({ agent, english }: { agent: AgentController; english: boolean }) {
  const events = agent.active?.events ?? []
  return <>
    <div className="agent-section-bar"><h2><Radio />{english ? "Execution trace" : "执行轨迹"}</h2><span>{agent.active?.events[0]?.run_id?.slice(0, 10) ?? (english ? "No active run" : "暂无运行")}</span></div>
    {agent.turns.length > 0 && <label className="agent-run-picker">{english ? "Inspect turn" : "选择轮次"}<select aria-label={english ? "Inspect turn" : "选择轮次"} value={agent.active?.id ?? ""} onChange={event => agent.setActiveId(event.target.value)}>{agent.turns.map((turn, index) => <option value={turn.id} key={turn.id}>{index + 1}. {turn.question.slice(0, 45)}</option>)}</select></label>}
    <p className="agent-loop-explanation">{english ? "Input → context → model → tools → observation. The model can repeat the loop before answering. These are execution events, not internal reasoning." : "输入 → 上下文 → 模型 → 工具 → 观察。模型可以再次进入循环，直到输出回答。这里展示执行事件，不展示内部推理。"}</p>
    <div className="agent-loop-events">{events.length ? events.map((event, index) => <article key={index} data-status={event.status ?? event.type}><span className="agent-event-time">{((event.elapsed_ms ?? 0) / 1000).toFixed(2)}s</span><div><strong>{event.stage ? stageInfo[event.stage].title : event.type}<small>{event.cycle ? (english ? "cycle " : "循环 ") + event.cycle : ""}</small></strong><p>{event.type === "answer" ? (english ? "Answer delivered to Chat" : "回答已发送至 Chat") : event.content}</p>{event.query && <code>{event.query}</code>}</div><span className="agent-event-kind">{event.status ?? event.type}</span></article>) : <p className="agent-panel-empty">{english ? "Send a question to see the real event sequence." : "发送问题后，可在这里查看真实事件顺序。"}</p>}</div>

  </>
}
