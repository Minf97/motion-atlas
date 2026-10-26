import { LoaderCircle, Play, Radio } from "lucide-react"
import { Button } from "@/components/ui/button"
import { stageInfo } from "./architecture"
import type { AgentController } from "./use-agent"

export function LoopPanel({ agent, english }: { agent: AgentController; english: boolean }) {
  const events = agent.active?.events ?? []
  return <>
    <div className="agent-section-bar"><h2><Radio />{english ? "Execution trace" : "执行轨迹"}</h2><span>{agent.active?.events[0]?.run_id?.slice(0, 10) ?? (english ? "No active run" : "暂无运行")}</span></div>
    {agent.turns.length > 0 && <label className="agent-run-picker">{english ? "Inspect turn" : "选择轮次"}<select aria-label={english ? "Inspect turn" : "选择轮次"} value={agent.active?.id ?? ""} onChange={event => agent.setActiveId(event.target.value)}>{agent.turns.map((turn, index) => <option value={turn.id} key={turn.id}>{index + 1}. {turn.question.slice(0, 45)}</option>)}</select></label>}
    <p className="agent-loop-explanation">{english ? "Input → context → model → tools → observation. The model can repeat the loop before answering. These are execution events, not internal reasoning." : "输入 → 上下文 → 模型 → 工具 → 观察。模型可以再次进入循环，直到输出回答。这里展示执行事件，不展示内部推理。"}</p>
    <div className="agent-loop-events">{events.length ? events.map((event, index) => <article key={index} data-status={event.status ?? event.type}><span className="agent-event-time">{((event.elapsed_ms ?? 0) / 1000).toFixed(2)}s</span><div><strong>{event.stage ? stageInfo[event.stage].title : event.type}<small>{event.cycle ? (english ? "cycle " : "循环 ") + event.cycle : ""}</small></strong><p>{event.type === "answer" ? (english ? "Answer delivered to Chat" : "回答已发送至 Chat") : event.content}</p>{event.query && <code>{event.query}</code>}</div><span className="agent-event-kind">{event.status ?? event.type}</span></article>) : <p className="agent-panel-empty">{english ? "Send a question to see the real event sequence." : "发送问题后，可在这里查看真实事件顺序。"}</p>}</div>
    <section className="agent-evaluation-panel"><div className="agent-section-bar"><h2>{english ? "Evaluation" : "评测"}</h2><Button size="sm" variant="outline" disabled={agent.evaluating || agent.loading} onClick={() => void agent.evaluate()}>{agent.evaluating ? <LoaderCircle className="agent-spin" /> : <Play />}{agent.evaluating ? (english ? "Running…" : "运行中…") : (english ? "Run cases" : "运行案例")}</Button></div><p>{english ? "Two fixed cases check tool selection, evidence, complete answers and source citations on the selected model." : "两个固定案例核对当前模型的工具选择、证据、完整回答和来源引用。"}</p>
      {agent.evaluationError && <p className="agent-chat-error" role="alert">{agent.evaluationError}</p>}
      {agent.evaluations.map(result => <article className="agent-eval-row" key={result.id}><header><strong>{result.question}</strong><span data-pass={result.passed}>{result.passed ? "PASS" : "FAIL"}</span></header><p>{result.tools.join(" → ")} · {result.duration_ms} ms</p><div>{Object.entries(result.checks).map(([name, passed]) => <span key={name} data-pass={passed}>{passed ? "✓" : "×"} {name}</span>)}</div></article>)}
      {!agent.evaluations.length && !agent.evaluating && <p className="agent-panel-empty">{english ? "No evaluation has been run in this session." : "当前会话还没有运行评测。"}</p>}
    </section>
  </>
}
