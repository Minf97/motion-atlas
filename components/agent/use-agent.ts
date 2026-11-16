"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { parseAgentEvent, type AgentEvaluation, type AgentModel, type AgentTurn, type AgentWorkspace } from "@/lib/agent"
import { conversationHistory } from "@/lib/agent-workspace"
import { readEventStream } from "@/lib/agent-stream"
import { readEvaluationRuns, saveEvaluationRun, saveFeedback, type EvaluationRun } from "@/lib/agent-evaluation-storage"

export const agentApiUrl = process.env.NEXT_PUBLIC_AGENT_API_URL?.replace(/\/$/, "")

// 管理真实运行状态
export function useAgent(english: boolean) {
  const [model, setModel] = useState<AgentModel>("deepseek")
  const [turns, setTurns] = useState<AgentTurn[]>([])
  const [activeId, setActiveId] = useState("")
  const [workspace, setWorkspace] = useState<AgentWorkspace | null>(null)
  const [connection, setConnection] = useState<"connecting" | "connected" | "error">("connecting")
  const [connectionError, setConnectionError] = useState("")
  const [evaluations, setEvaluations] = useState<AgentEvaluation[]>([])
  const [evaluationSummary, setEvaluationSummary] = useState<AgentEvaluation | null>(null)
  const [evaluating, setEvaluating] = useState(false)
  const [evaluationRuns, setEvaluationRuns] = useState<EvaluationRun[]>([])
  const [evaluationProgress, setEvaluationProgress] = useState(0)
  const [feedbackResults, setFeedbackResults] = useState<Record<string, { result?: Record<string, unknown>; error?: string; loading?: boolean }>>({})
  const [evaluationError, setEvaluationError] = useState("")
  const controller = useRef<AbortController | null>(null)
  const evaluationController = useRef<AbortController | null>(null)
  const workspaceController = useRef<AbortController | null>(null)
  const loading = turns.some(turn => turn.status === "running")
  const active = turns.find(turn => turn.id === activeId)

  // 加载公开工作区
  const connect = useCallback(async () => {
    workspaceController.current?.abort()
    const abort = new AbortController()
    workspaceController.current = abort
    setConnection("connecting")
    setConnectionError("")
    if (!agentApiUrl) {
      setConnection("error")
      setConnectionError(english ? "Agent API is not configured." : "Agent API 尚未配置。")
      return
    }
    try {
      const response = await fetch(agentApiUrl + "/workspace", { signal: abort.signal })
      if (!response.ok) throw new Error("Workspace API returned " + response.status)
      const value = await response.json() as AgentWorkspace
      if (!Array.isArray(value.knowledge) || !Array.isArray(value.tools) || !Array.isArray(value.models)) throw new Error("Invalid workspace response")
      if (abort.signal.aborted) return
      setWorkspace(value)
      setConnection("connected")
    } catch (error) {
      if (abort.signal.aborted) return
      setWorkspace(null)
      setConnection("error")
      setConnectionError(error instanceof Error ? error.message : String(error))
    }
  }, [english])

  useEffect(() => {
    setEvaluationRuns(readEvaluationRuns())
    void connect()
    return () => { workspaceController.current?.abort(); controller.current?.abort(); evaluationController.current?.abort() }
  }, [connect])

  // 提交并跟踪阶段
  async function send(question: string) {
    if (!question.trim() || controller.current) return
    const id = crypto.randomUUID()
    const started = performance.now()
    const abort = new AbortController()
    controller.current = abort
    const turn: AgentTurn = { id, question: question.trim(), model, events: [], status: "running", duration_ms: 0 }
    setTurns(current => [...current, turn])
    setActiveId(id)
    try {
      if (!agentApiUrl) throw new Error(english ? "Agent API is not configured." : "Agent API 尚未配置。")
      const response = await fetch(agentApiUrl + "/chat", {
        method: "POST", headers: { "Content-Type": "application/json" }, signal: abort.signal,
        body: JSON.stringify({ question: turn.question, model, history: conversationHistory(turns) }),
      })
      let answered = false
      await readEventStream(response, frame => {
        const event = parseAgentEvent(frame)
        if (!event) return
        setTurns(current => current.map(item => item.id === id ? { ...item, events: [...item.events, event], duration_ms: event.elapsed_ms ?? Math.round(performance.now() - started) } : item))
        if (event.type === "error") throw new Error(event.content)
        if (event.type === "answer") answered = true
      })
      if (!answered) throw new Error(english ? "The stream ended without an answer." : "事件流结束，但没有收到回答。")
      setTurns(current => current.map(item => item.id === id ? { ...item, status: "completed", duration_ms: Math.round(performance.now() - started) } : item))
    } catch (error) {
      setTurns(current => current.map(item => item.id === id ? { ...item, status: abort.signal.aborted ? "cancelled" : "error",
        error: abort.signal.aborted ? undefined : error instanceof Error ? error.message : String(error), duration_ms: Math.round(performance.now() - started) } : item))
    } finally {
      controller.current = null
    }
  }

  // 运行固定评测集
  async function evaluate() {
    if (evaluationController.current || loading) return
    const abort = new AbortController()
    evaluationController.current = abort
    setEvaluating(true)
    setEvaluations([])
    setEvaluationSummary(null)
    setEvaluationProgress(0)
    setEvaluationError("")
    try {
      if (!agentApiUrl) throw new Error(english ? "Agent API is not configured." : "Agent API 尚未配置。")
      const response = await fetch(agentApiUrl + "/evaluate?model=" + model + "&dataset_version=v1", { method: "POST", signal: abort.signal })
      const completedCases: AgentEvaluation[] = []
      await readEventStream(response, frame => {
        const line = frame.split("\n").find(line => line.startsWith("data:"))
        if (!line) return
        const result = JSON.parse(line.slice(5)) as AgentEvaluation & { error?: string }
        if (result.error) throw new Error(result.error)
        if (result.type === "summary") { setEvaluationSummary(result); setEvaluationRuns(saveEvaluationRun({ saved_at: new Date().toISOString(), cases: completedCases, summary: result })) }
        else { completedCases.push(result); setEvaluations(current => [...current, result]); setEvaluationProgress(current => current + 1) }
      })
    } catch (error) {
      if (!abort.signal.aborted) setEvaluationError(error instanceof Error ? error.message : String(error))
    } finally {
      setEvaluating(false)
      evaluationController.current = null
    }
  }

  async function submitFeedback(turn: AgentTurn, rating: "thumbs_up" | "thumbs_down", reason?: string) {
    const id = turn.id
    setFeedbackResults(current => ({ ...current, [id]: { loading: true } }))
    try {
      if (!agentApiUrl) throw new Error("Agent API is not configured")
      const answer = turn.events.filter(event => event.type === "answer").map(event => event.content).join("")
      const feedback = { saved_at: new Date().toISOString(), turn_id: id, question: turn.question, answer, events: turn.events, rating, reason }
      const response = await fetch(agentApiUrl + "/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: turn.model, question: turn.question, answer, events: turn.events, rating, reason }) })
      if (!response.ok) throw new Error("Feedback API returned " + response.status)
      const result = await response.json() as Record<string, unknown>
      setFeedbackResults(current => ({ ...current, [id]: { result } }))
      saveFeedback({ ...feedback, judge: result })
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      const answer = turn.events.filter(event => event.type === "answer").map(event => event.content).join("")
      saveFeedback({ saved_at: new Date().toISOString(), turn_id: id, question: turn.question, answer, events: turn.events, rating, reason, error: message })
      setFeedbackResults(current => ({ ...current, [id]: { error: message } }))
    }
  }

  return { model, setModel, turns, active, setActiveId, workspace, connection, connectionError, connect, loading,
    send, stop: () => controller.current?.abort(), newChat: () => { if (!controller.current) { setTurns([]); setActiveId("") } },
    evaluations, evaluationSummary, evaluating, evaluationError, evaluationProgress, evaluationRuns, feedbackResults, evaluate, submitFeedback }
}
export type AgentController = ReturnType<typeof useAgent>
