import type { AgentEvaluation } from "./agent"

const KEY = "minf-agent-evaluations-v1"
const MAX_RUNS = 5
const FEEDBACK_KEY = "minf-agent-feedback-v1"
export type EvaluationRun = { saved_at: string; cases: AgentEvaluation[]; summary: AgentEvaluation; feedback?: Record<string, unknown> }
export type StoredFeedback = { saved_at: string; turn_id: string; question: string; answer: string; events: unknown[]; rating: "thumbs_up" | "thumbs_down"; reason?: string; judge?: Record<string, unknown>; error?: string }

export function readEvaluationRuns(): EvaluationRun[] {
  const raw = localStorage.getItem(KEY)
  if (!raw) return []
  const parsed = JSON.parse(raw) as EvaluationRun[]
  if (!Array.isArray(parsed)) throw new Error("Invalid evaluation history")
  return parsed.slice(0, MAX_RUNS)
}

export function saveEvaluationRun(run: EvaluationRun): EvaluationRun[] {
  const runs = [run, ...readEvaluationRuns()].slice(0, MAX_RUNS)
  localStorage.setItem(KEY, JSON.stringify(runs))
  return runs
}

// 保留最近反馈与轨迹
export function saveFeedback(feedback: StoredFeedback): StoredFeedback[] {
  const previous = JSON.parse(localStorage.getItem(FEEDBACK_KEY) ?? "[]") as StoredFeedback[]
  if (!Array.isArray(previous)) throw new Error("Invalid feedback history")
  const saved = [feedback, ...previous].slice(0, 20)
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(saved))
  return saved
}
