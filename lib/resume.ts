import { resumeSkillGroups } from "./resume-skills.ts"

export const personal = { birthday: "Dec 2000", mbti: "ESTP" }
export const education = { school: "广东石油化工学院", date: "Sep 2019 — July 2023" }

export const profile = {
  name: "胥昱全",
  role: "Agent 工程师 / AI 应用全栈工程师",
  location: "杭州",
  email: "287728237@qq.com",
  phone: "18938878019",
  github: "https://github.com/Minf97",
  blog: "https://blog.csdn.net/MinfCONS",
  portfolio: "https://minf97.github.io/motion-atlas/",
  summary: "具备 Agent 工程化、电商增长数据产品及全栈研发经验，关注 LLM 在真实业务场景中的可靠性与落地效率。",
  skills: resumeSkillGroups,
}

export const selfEvaluation = [
  { title: "懂用户", description: "具备电商增长与 AI 建站产品实践，能从用户操作路径和运营需求出发，将业务问题拆解为可交付的功能与流程。" },
  { title: "善数据", description: "具备事件建模、转化漏斗、A/B Test 与 RAG 效果评估经验，关注指标口径、实验结果及业务成本，用数据检验产品与模型效果。" },
  { title: "能落地", description: "具备 Python / TypeScript 全栈研发能力，参与打通 Agent 编排、上下文管理、工具执行、云沙箱、数据后台与在线预览链路。" },
]

export const experience = [
  { company: "蔚灵深度科技有限公司", role: "Agent / 全栈工程师", date: "2025.12 — 至今" },
  { company: "Pacagen — New York", role: "Software Engineer", date: "2025.05 — 2025.12" },
  { company: "深圳用图科技有限公司", role: "前端 K 线工程师", date: "2024.02 — 2025.03" },
  { company: "深圳四博智联科技有限公司", role: "前端工程师", date: "2022.10 — 2024.02" },
]

export const projects = [
  { name: "We 校园", role: "微信小程序", date: "2020 — 至今", details: ["参与校园课表、成绩查询及校园社区产品研发，覆盖数十所高校；运营三年累计用户超过 30 万，日活超过 2 万，并建设 GitLab CI/CD、动态主题和小程序动态化引擎。"] },
  { name: "MurmRay", role: "Polymarket AI 机会分析", date: "XLayer Web3 黑客松", details: ["使用 WXT、React、TypeScript、Hono、OpenRouter、InsForge 与 Solidity，实现市场检索、AI 信号判断、链上登记和 active / expired / resolved 结果流转；获一等奖（2,000 USDT）。"] },
  { name: "Agora Space", role: "Multi-Agent 协作学习", date: "AdventureX 2025", details: ["基于 Kimi、Web Speech API、MiniMax TTS、A* 寻路、text-embedding-3-small、pgvector、Durable Objects 与 WebSocket，实现语音访谈、数字人格画像和多 Agent 实时协作；获 AdventureX 二等奖及 BUILD_QUES 新加坡站全球前十。"] },
]
