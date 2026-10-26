import type { AgentEvent, AgentStage, AgentTurn } from "./agent"

export const agentSections = ["Overview", "Loop", "Memory", "Tool", "Database", "Settings"] as const
export type AgentSection = typeof agentSections[number]
export const agentStages: AgentStage[] = ["input", "context", "model", "tools", "observe", "answer"]

// 推导当前链路
export function stageStates(turn?: AgentTurn) {
  const states: Record<AgentStage, "pending" | "running" | "completed" | "error" | "cancelled"> = {
    input: "pending", context: "pending", model: "pending", tools: "pending", observe: "pending", answer: "pending",
  }
  for (const event of turn?.events ?? []) {
    if (event.type === "stage" && event.stage && event.status) states[event.stage] = event.status
    if (event.type === "error" && event.stage) states[event.stage] = "error"
  }
  if (turn && turn.status !== "running") {
    for (const stage of agentStages) {
      if (states[stage] === "running") states[stage] = turn.status === "cancelled" ? "cancelled" : "error"
    }
  }
  return states
}

// 关联工具生命周期
export function toolCalls(events: AgentEvent[]) {
  const calls = new Map<string, AgentEvent>()
  for (const event of events) {
    if (event.type !== "tool") continue
    const key = event.call_id ?? String(calls.size)
    calls.set(key, event)
  }
  return [...calls.values()]
}

// 只传已完成对话
export function conversationHistory(turns: AgentTurn[]) {
  return turns.filter(turn => turn.status === "completed").flatMap(turn => [
    { role: "user" as const, content: turn.question },
    { role: "assistant" as const, content: turn.events.filter(event => event.type === "answer").map(event => event.content).join("") },
  ]).filter(message => message.content.trim()).slice(-20)
}

// 保留公开文档检索
export function filterKnowledge<T extends { title: string; text: string }>(chunks: T[], query: string) {
  const normalized = query.trim().toLowerCase()
  return chunks.filter(chunk => (chunk.title + " " + chunk.text).toLowerCase().includes(normalized))
}
