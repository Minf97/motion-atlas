import { resumeSkillGroups } from "./resume-skills.ts"

export const personal = { birthday: "Dec 2000", mbti: "ESTP" }
export const education = { school: "Guangdong University of Petrochemical Technology", date: "Sep 2019 — July 2023" }

export const profile = {
  name: "Minf",
  role: "Agent Engineer / AI Application Full-stack Engineer",
  location: "Hangzhou",
  email: "287728237@qq.com",
  phone: "18938878019",
  github: "https://github.com/Minf97",
  blog: "https://blog.csdn.net/MinfCONS",
  portfolio: "https://minf97.github.io/motion-atlas/",
  summary: "Agent engineering, ecommerce growth analytics and full-stack product development, with a focus on reliable and practical LLM applications.",
  skills: resumeSkillGroups,
}

export const selfEvaluation = [
  { title: "Understand users", description: "Hands-on experience with ecommerce growth and AI website-building products. Turn user journeys and operational needs into deliverable features and workflows." },
  { title: "Work with data", description: "Experience with event modeling, conversion funnels, A/B testing and RAG evaluation. Use consistent metric definitions, experiment results and business costs to assess product and model performance." },
  { title: "Deliver end to end", description: "Full-stack development in Python and TypeScript, connecting agent orchestration, context management, tool execution, cloud sandboxes, data backends and live previews." },
]

export const experience = [
  { company: "Weiling Deep Technology", role: "Agent / Full-stack Engineer", date: "Dec 2025 — Present" },
  { company: "Pacagen — New York", role: "Software Engineer", date: "May 2025 — Dec 2025" },
  { company: "深圳用图科技有限公司", role: "Frontend Chart Engineer", date: "Feb 2024 — Mar 2025" },
  { company: "深圳四博智联科技有限公司", role: "Frontend Engineer", date: "Oct 2022 — Feb 2024" },
]

export const projects = [
  { name: "We Campus", role: "WeChat Mini Program", date: "2020 — Present", details: ["Worked on schedules, grades and campus communities across dozens of universities; reached 300,000+ users and 20,000+ DAU over three years, with GitLab CI/CD and dynamic themes."] },
  { name: "MurmRay", role: "Polymarket AI Opportunity Analysis", date: "XLayer Web3 Hackathon", details: ["Built market retrieval, AI signal analysis, on-chain registration and active / expired / resolved result tracking with WXT, React, Hono, OpenRouter, InsForge and Solidity. Won first prize (2,000 USDT)."] },
  { name: "Agora Space", role: "Multi-agent Collaborative Learning", date: "AdventureX 2025", details: ["Built voice interviews, digital personality profiles and real-time multi-agent collaboration with Kimi, Web Speech API, MiniMax TTS, A* pathfinding, pgvector, Durable Objects and WebSockets. Won second prize at AdventureX 2025 and placed in the global top 10 at BUILD_QUES Singapore."] },
]
