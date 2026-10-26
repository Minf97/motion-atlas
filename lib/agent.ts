export type AgentEventType = "stage" | "plan" | "tool" | "evidence" | "answer" | "error"
export type AgentStage = "input" | "context" | "model" | "tools" | "observe" | "answer"
export type AgentStatus = "running" | "completed" | "error"
export type AgentModel = "openai" | "deepseek"
export type AgentSource = { id: number; title: string; kind: string; url: string; excerpt: string }
export type AgentEvent = {
  type: AgentEventType
  content: string
  stage?: AgentStage
  status?: AgentStatus
  query?: string
  sources?: AgentSource[]
  call_id?: string
  cycle?: number
  duration_ms?: number
  elapsed_ms?: number
  run_id?: string
  sequence?: number
}
export type AgentEvaluation = {
  type?: "case" | "summary"
  id: string; question?: string; passed?: boolean; checks?: Record<string, boolean>; tools?: string[]
  scores?: Record<string, number>; trace?: { events: number; tool_calls: number; evidence: number; answer_chars: number }
  run_id: string; model: AgentModel; duration_ms: number
  cases?: number; pass_rate?: number; overall_score?: number
}
export type AgentTurn = {
  id: string; question: string; model: AgentModel; events: AgentEvent[]
  status: "running" | "completed" | "error" | "cancelled"; error?: string; duration_ms: number
}
export type AgentWorkspace = {
  models: { id: AgentModel; name: string; configured: boolean; host: string }[]
  tools: { name: string; description: string; parameters: Record<string, unknown>; configured: boolean }[]
  knowledge: { id: number; title: string; kind: string; url: string; text: string }[]
  max_steps: number
  storage: { documents: string; index: string; memory: string; persistent_chat: boolean }
}

// 解析流式事件
export function parseAgentEvent(frame: string): AgentEvent | null {
  const data = frame.split("\n").filter(line => line.startsWith("data:")).map(line => line.slice(5).trimStart()).join("\n")
  if (!data) return null
  const event = JSON.parse(data) as AgentEvent
  if (!["stage", "plan", "tool", "evidence", "answer", "error"].includes(event.type) || typeof event.content !== "string") {
    throw new Error("Invalid agent event")
  }
  return event
}

export const recommendedQuestions = [
  "你做过哪些 Agent 项目？", "你在 Pacagen 负责什么？", "你最擅长哪些前端和 AI 技术？",
  "可以介绍一下 We 校园吗？", "你有哪些作品集案例？", "Python 官方网站目前显示的最新稳定版本是什么？",
]
export const recommendedQuestionsEn = [
  "What agent projects have you built?", "What did you work on at Pacagen?", "What frontend and AI technologies do you know best?",
  "Can you introduce We Campus?", "What is in your portfolio?", "What is the latest stable Python release listed on python.org?",
]

// 聚合回答与来源
export function splitAgentEvents(events: AgentEvent[]) {
  const steps = events.filter(event => !["answer", "error", "stage"].includes(event.type))
  const answer = events.filter(event => event.type === "answer").map(event => event.content).join("")
  const sources = events.flatMap(event => event.sources ?? [])
  return { steps, answer, sources: [...new Map(sources.map(source => [source.id, source])).values()] }
}
