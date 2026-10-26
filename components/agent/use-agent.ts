"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { parseAgentEvent, type AgentEvaluation, type AgentModel, type AgentTurn, type AgentWorkspace } from "@/lib/agent"
import { conversationHistory } from "@/lib/agent-workspace"
import { readEventStream } from "@/lib/agent-stream"

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
  const [evaluating, setEvaluating] = useState(false)
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
    setEvaluationError("")
    try {
      if (!agentApiUrl) throw new Error(english ? "Agent API is not configured." : "Agent API 尚未配置。")
      const response = await fetch(agentApiUrl + "/evaluate?model=" + model, { method: "POST", signal: abort.signal })
      await readEventStream(response, frame => {
        const line = frame.split("\n").find(line => line.startsWith("data:"))
        if (!line) return
        const result = JSON.parse(line.slice(5)) as AgentEvaluation & { error?: string }
        if (result.error) throw new Error(result.error)
        setEvaluations(current => [...current, result])
      })
    } catch (error) {
      if (!abort.signal.aborted) setEvaluationError(error instanceof Error ? error.message : String(error))
    } finally {
      setEvaluating(false)
      evaluationController.current = null
    }
  }

  return { model, setModel, turns, active, setActiveId, workspace, connection, connectionError, connect, loading,
    send, stop: () => controller.current?.abort(), newChat: () => { if (!controller.current) { setTurns([]); setActiveId("") } },
    evaluations, evaluating, evaluationError, evaluate }
}
export type AgentController = ReturnType<typeof useAgent>
