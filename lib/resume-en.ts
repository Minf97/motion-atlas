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
    "Help build We0, a multi-agent AI coding, website-building and growth platform, evolving Supervisor, fixed Workflow, single-agent and Main / Design Handoff architectures.",
    "Designed an event protocol covering 29 event types including text, thinking summaries, tool calls, results, errors, retries, context compression, questions and agent handoffs; Redis Streams + SSE support live updates and replay.",
    "Built the E2B sandbox, remote filesystem, Shell, Abort, QuickStart and MinIO artifact persistence layer; reduced multi-page design generation from 8–12 minutes to 1–4 minutes through concurrent generation.",
    "Built full-stack templates with React 18, Razzle, Hono and Supabase. models/*.json is the source of truth for database, CMS, CRUD and API specs, generating SQL, types, validation, services, routes and API_SPEC automatically.",
    "Extended Wechatsync for multi-channel publishing and built a Doubao account pool plus GEO detection workflow for content growth.",
  ] },
  { company: "Pacagen — New York", role: "Software Engineer", location: "New York", date: "Oct 2024 — Apr 2026", details: [
    "Led a Growth Analytics platform from zero to one around behavior analytics, marketing conversion, A/B testing and business data.",
    "Designed event schemas and experiment allocation for page views, product views, cart, checkout, purchase, SSR experiments and attribution; visualized results with ECharts.",
    "Abstracted email delivery and templates, reducing tool spend by about $3,700 per month; internal analytics reduced SaaS costs by at least $1,000 per month.",
    "Built a RAG support bot with 256–512-token chunks, Embeddings, vector retrieval, BM25, Rerank and Shopify Function Calling for knowledge, order and inventory queries.",
    "Used RAGAS and human-labeled sets for offline evaluation; migrated the Shopify site to Hydrogen + Remix and built a Kling AI + Coze marketing-video workflow.",
  ] },
]

export const projects = [
  { name: "Insight Copilot", role: "Commerce Analytics Agent · NL2SQL + Attribution", date: "Independent project", details: ["Built a four-layer ODS / DWD / DWS / ADS analytics model for Shopify orders and events, with 18 metric definitions fixed in a YAML semantic layer.", "Implemented idempotent Python ETL, metric retrieval, SQL allowlists, read-only credentials, forced LIMITs and timeouts; supports period comparison and channel, category and region attribution.", "Evaluated execution accuracy and result consistency on 60 questions, feeding schema ambiguity and join failures back into a few-shot set."] },
  { name: "We Campus", role: "WeChat Mini Program", date: "2020 — Present", details: ["Worked on schedules, grades and campus communities across dozens of universities; reached 300,000+ users and 20,000+ DAU over three years, with GitLab CI/CD and dynamic themes."] },
  { name: "MurmRay", role: "Polymarket AI Opportunity Analysis", date: "XLayer Web3 Hackathon", details: ["Built market retrieval, AI signal analysis, on-chain registration and active / expired / resolved result tracking with WXT, React, Hono, OpenRouter, InsForge and Solidity. Won first prize (2,000 USDT)."] },
  { name: "Agora Space", role: "Multi-agent Collaborative Learning", date: "AdventureX 2025", details: ["Built voice interviews, digital personality profiles and real-time multi-agent collaboration with Kimi, Web Speech API, MiniMax TTS, A* pathfinding, pgvector, Durable Objects and WebSockets. Won second prize at AdventureX 2025 and placed in the global top 10 at BUILD_QUES Singapore."] },
]
