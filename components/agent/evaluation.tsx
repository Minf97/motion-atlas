import { useState } from "react"
import { Filter, LoaderCircle, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { AgentController } from "./use-agent"

const groups = ["all", "personal", "project", "capability", "context", "refusal", "web", "tool", "citation"]
export function EvaluationPanel({ agent, english }: { agent: AgentController; english: boolean }) {
  const [group, setGroup] = useState("all")
  const [selectedRunId, setSelectedRunId] = useState("")
  const selectedRun = agent.evaluationRuns.find(run => run.summary.run_id === selectedRunId)
  const cases = selectedRun?.cases ?? agent.evaluations
  const results = group === "all" ? cases : cases.filter(item => item.group === group)
  const summary = selectedRun?.summary ?? agent.evaluationSummary
  return <>
    <div className="agent-panel-intro"><Filter /><h2>{english ? "Evaluation workspace" : "评测工作台"}</h2><p>{english ? "Run the reviewed dataset and inspect auditable traces, scores and failure categories." : "运行审核后的数据集，查看可审计轨迹、分数和失败分类。"}</p></div>
    <div className="agent-evaluation-toolbar"><span>v1 · 18 {english ? "cases" : "个案例"}</span><select aria-label={english ? "Evaluation group" : "评测分组"} value={group} onChange={event => setGroup(event.target.value)}>{groups.map(item => <option key={item} value={item}>{item === "all" ? (english ? "All groups" : "全部分组") : item}</option>)}</select><select aria-label={english ? "Recent runs" : "历史运行"} value={selectedRunId} onChange={event => setSelectedRunId(event.target.value)}><option value="">{english ? "Current run" : "当前运行"}</option>{agent.evaluationRuns.map(run => <option key={run.summary.run_id} value={run.summary.run_id}>{new Date(run.saved_at).toLocaleString()} · {run.summary.run_id.slice(0, 8)}</option>)}</select><Button size="sm" onClick={() => { setSelectedRunId(""); void agent.evaluate() }} disabled={agent.evaluating || agent.loading}>{agent.evaluating ? <LoaderCircle className="agent-spin" /> : <Play />}{agent.evaluating ? `${agent.evaluationProgress}/18` : (english ? "Run suite" : "运行评测集")}</Button></div>
    {agent.evaluationError && <p className="agent-chat-error" role="alert">{agent.evaluationError}</p>}
    {summary && <div className="agent-eval-summary"><div><span>{english ? "Pass rate" : "通过率"}</span><strong>{Math.round((summary.pass_rate ?? 0) * 100)}%</strong></div><div><span>{english ? "Quality" : "综合评分"}</span><strong>{Math.round((summary.overall_score ?? 0) * 100)}%</strong></div><div><span>{english ? "Latency" : "平均延迟"}</span><strong>{summary.average_latency_ms ?? 0}ms</strong></div><div><span>{english ? "Failures" : "失败案例"}</span><strong>{Object.values(summary.failure_counts ?? {}).reduce<number>((a, b) => a + b, 0)}</strong></div></div>}
    {results.map(item => <details className="agent-eval-row" key={item.id}><summary><strong>{item.id}</strong><span data-pass={item.passed}>{item.passed ? "PASS" : "FAIL"}</span></summary><p>{item.question}</p><p>{english ? "Expected tools" : "预期工具"}: {item.expected_tools?.join(", ") || "—"} · {english ? "Actual" : "实际"}: {item.tools?.join(" → ") || "—"} · {item.duration_ms}ms</p><div className="agent-eval-scores">{Object.entries(item.scores ?? {}).map(([name, score]) => <span key={name}>{name.replaceAll("_", " ")} <b>{Math.round(score * 100)}%</b></span>)}</div><p>{english ? "Failures" : "失败分类"}: {item.failure_categories?.join(", ") || (english ? "none" : "无")}</p>{item.sources?.map(source => <a className="agent-text-link" href={source.url} target="_blank" rel="noreferrer" key={`${source.id}-${source.url}`}>{source.title} ↗</a>)}<div className="agent-eval-trace-details">{item.trace?.spans?.map((span, index) => <p key={span.span_id ?? index}><b>{span.sequence ?? index + 1} · {span.stage ?? span.type}</b> {span.content} {span.query && <code>{span.query}</code>}</p>)}</div><small>{english ? "Trace" : "轨迹"}: {item.trace?.events ?? 0} events · {item.trace?.evidence ?? 0} evidence · {item.run_id.slice(0, 8)}</small></details>)}
    {!results.length && !agent.evaluating && <p className="agent-panel-empty">{english ? "Run the suite to create a trace." : "运行评测集后，这里会显示完整轨迹。"}</p>}
  </>
}
