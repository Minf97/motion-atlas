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
  skills: [
    { title: "Agent Engineering", items: "Agent Loop, Tool Calling, Handoff, Workflow, Context Engineering, session persistence, context compression, tool recovery, multi-model routing" },
    { title: "RAG & Evaluation", items: "document parsing, Embeddings, vector retrieval, BM25, Rerank, context injection, RAGAS, human-labeled sets, bad-case feedback" },
    { title: "Data Products", items: "event models, behavior analytics, conversion funnels, A/B testing, attribution, ECharts, Supabase, PostgreSQL, SQL" },
    { title: "Full-stack", items: "Python, FastAPI, LangGraph, TypeScript, React, Next.js, Hono, Redis, SSE, Supabase" },
  ],
}

export const experience = [
  { company: "Weiling Deep Technology", role: "Agent / Full-stack Engineer", location: "Hangzhou", date: "Dec 2025 — Present", details: [
    "Help build We0, a multi-agent AI coding, website-building and growth platform, covering agent architecture, live event streams, cloud sandboxes and full-stack templates; concurrent generation reduced multi-page design delivery from 8–12 minutes to 1–4 minutes.",
    "Also built the publishing, account-pool and GEO detection capabilities that connect product generation with distribution and growth.",
  ] },
  { company: "Pacagen — New York", role: "Software Engineer", location: "New York", date: "Oct 2024 — Apr 2026", details: [
    "Owned Pacagen's Growth Analytics, experimentation and Shopify Headless work, building a unified path from behavioral events to attribution and reducing SaaS costs by at least $1,000 per month through internal analytics.",
    "Built a RAG support bot and marketing-content workflow for knowledge, order and handoff scenarios; also reduced email tooling spend by about $3,700 per month through a shared delivery system.",
  ] },
]

export const projects = [
  { name: "Insight Copilot", role: "Commerce Analytics Agent · NL2SQL + Attribution", date: "Independent project", details: ["Built a four-layer ODS / DWD / DWS / ADS analytics model for Shopify orders and events, with 18 metric definitions fixed in a YAML semantic layer.", "Implemented idempotent Python ETL, metric retrieval, SQL allowlists, read-only credentials, forced LIMITs and timeouts; supports period comparison and channel, category and region attribution.", "Evaluated execution accuracy and result consistency on 60 questions, feeding schema ambiguity and join failures back into a few-shot set."] },
  { name: "We Campus", role: "WeChat Mini Program", date: "2020 — Present", details: ["Worked on schedules, grades and campus communities across dozens of universities; reached 300,000+ users and 20,000+ DAU over three years, with GitLab CI/CD and dynamic themes."] },
  { name: "MurmRay", role: "Polymarket AI Opportunity Analysis", date: "XLayer Web3 Hackathon", details: ["Built market retrieval, AI signal analysis, on-chain registration and active / expired / resolved result tracking with WXT, React, Hono, OpenRouter, InsForge and Solidity. Won first prize (2,000 USDT)."] },
  { name: "Agora Space", role: "Multi-agent Collaborative Learning", date: "AdventureX 2025", details: ["Built voice interviews, digital personality profiles and real-time multi-agent collaboration with Kimi, Web Speech API, MiniMax TTS, A* pathfinding, pgvector, Durable Objects and WebSockets. Won second prize at AdventureX 2025 and placed in the global top 10 at BUILD_QUES Singapore."] },
]
