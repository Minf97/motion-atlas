import { CircleAlert, Check, Clock3, LoaderCircle, Wrench } from "lucide-react"
import { toolCalls } from "@/lib/agent-workspace"
import type { AgentTurn } from "@/lib/agent"
import { AgentSources } from "./sources"

export function ToolHistory({ turns, english, onInspect }: { turns: AgentTurn[]; english: boolean; onInspect?: (id: string) => void }) {
  const calls = turns.flatMap(turn => toolCalls(turn.events).map(call => ({ turn, call })))
  if (!calls.length) return <div className="agent-tool-empty"><Wrench /><h3>{english ? "No tool calls yet" : "暂无工具调用"}</h3><p>{english ? "Executed tools, arguments and results will appear here." : "工具执行后，参数、结果和耗时会出现在这里。"}</p></div>
  return <div className="agent-tool-history">{calls.map(({ turn, call }, index) => {
    const failed = call.status === "running" && turn.status === "error"
    const pending = call.status === "running" && turn.status === "running"
    const Icon = pending ? LoaderCircle : failed ? CircleAlert : call.status === "completed" ? Check : Clock3
    return <details key={turn.id + (call.call_id ?? index)} className="agent-tool-call" data-status={failed ? "error" : call.status}>
      <summary><Icon className={pending ? "agent-spin" : ""} /><span>{call.content}<small>{english ? "Turn" : "轮次"} {turns.indexOf(turn) + 1} · {call.duration_ms === undefined ? (pending ? "running" : turn.status) : call.duration_ms + " ms"}</small></span><span className="agent-tool-status">{pending ? "Running" : failed ? "Failed" : call.status === "completed" ? "Done" : turn.status}</span></summary>
      <div className="agent-tool-body"><label>{english ? "Arguments" : "调用参数"}</label><pre>{JSON.stringify({ query: call.query }, null, 2)}</pre>{failed && <p className="agent-error-text">{turn.error}</p>}<AgentSources sources={call.sources ?? []} english={english} />{onInspect && <button className="agent-text-link" onClick={() => onInspect(turn.id)}>{english ? "Inspect this turn" : "查看这一轮链路"}</button>}</div>
    </details>
  })}</div>
}
