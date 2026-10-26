import { useId } from "react"
import { Check, Circle, CircleAlert, LoaderCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AgentStage, AgentTurn } from "@/lib/agent"
import { stageStates } from "@/lib/agent-workspace"

export const stageInfo: Record<AgentStage, { title: string; en: string; zh: string }> = {
  input: { title: "Input", en: "Receive the user request", zh: "接收用户请求" },
  context: { title: "Context", en: "Build working memory", zh: "组装对话上下文" },
  model: { title: "Model", en: "Decide the next action", zh: "决定下一步行动" },
  tools: { title: "Tools", en: "Execute read-only tools", zh: "执行只读工具" },
  observe: { title: "Observe", en: "Read results & evidence", zh: "读取结果与证据" },
  answer: { title: "Answer", en: "Respond with citations", zh: "回答并附上引用" },
}
const positions: Record<AgentStage, { left: string; top: string }> = {
  input: { left: "4%", top: "20%" }, context: { left: "37%", top: "20%" }, model: { left: "70%", top: "20%" },
  answer: { left: "4%", top: "67%" }, observe: { left: "37%", top: "67%" }, tools: { left: "70%", top: "67%" },
}
const stateIcons = { pending: Circle, running: LoaderCircle, completed: Check, error: CircleAlert, cancelled: CircleAlert }
// 等宽状态标签文案
const stateLabels: Record<string, string> = { pending: "WAIT", running: "RUN", completed: "OK", error: "ERR", cancelled: "STOP" }

// 根据事件点亮节点
export function Architecture({ turn, selected, onSelect, english }: { turn?: AgentTurn; selected: AgentStage; onSelect: (stage: AgentStage) => void; english: boolean }) {
  const states = stageStates(turn)
  const marker = useId().replaceAll(":", "")
  return <div className="agent-diagram-scroll"><div className="agent-diagram" aria-label={english ? "Live agent architecture" : "实时 Agent 架构"}>
    <svg viewBox="0 0 600 300" preserveAspectRatio="none" aria-hidden="true">
      <defs><marker id={marker} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 1 L 8 5 L 0 9" fill="none" stroke="currentColor" strokeWidth="1.5" /></marker></defs>
      <g fill="none" strokeWidth="1.2" markerEnd={"url(#" + marker + ")"}>
        <path d="M174 94 H218" data-live={states.context === "running"} />
        <path d="M372 94 H416" data-live={states.model === "running"} />
        <path d="M498 124 V196" data-live={states.tools === "running"} />
        <path d="M420 232 H378" data-live={states.observe === "running"} />
        <path d="M299 199 V154 H457 V127" className="agent-return-edge" data-live={states.model === "running" && (turn?.events.some(event => event.type === "evidence") ?? false)} />
        <path d="M447 60 V30 H105 V198" className="agent-answer-edge" data-live={states.answer === "running"} />
      </g>
      <text x="266" y="146">{english ? "observe → decide" : "观察结果 → 再次决策"}</text>
      <text x="261" y="21">{english ? "when ready, answer" : "证据充分后回答"}</text>
    </svg>
    {Object.entries(stageInfo).map(([name, info], index) => {
      const stage = name as AgentStage
      const Icon = stateIcons[states[stage]]
      return <button type="button" key={stage} data-stage={stage} data-status={states[stage]} style={positions[stage]} className={cn("agent-node", selected === stage && "is-selected")} onClick={() => onSelect(stage)} aria-pressed={selected === stage} aria-label={info.title + " · " + states[stage]}>
        <span className="agent-node-top"><span className="agent-node-index">{String(index + 1).padStart(2, "0")}</span><Icon className={states[stage] === "running" ? "agent-spin" : ""} /><strong>{info.title}</strong><em className="agent-node-state">{stateLabels[states[stage]]}</em></span>
        <span>{english ? info.en : info.zh}</span>
      </button>
    })}
  </div></div>
}
