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
  skills: [
    { title: "Agent 工程化", items: "Agent Loop、Tool Calling、Handoff、Workflow、Context Engineering、会话持久化、上下文压缩、工具恢复、多模型适配" },
    { title: "RAG 与评估", items: "文档解析、Embedding、向量检索、BM25、Rerank、上下文注入、RAGAS、人工标注集、bad case 回流" },
    { title: "数据产品", items: "事件模型、用户行为分析、转化漏斗、A/B Test、转化归因、ECharts、Supabase、PostgreSQL、SQL" },
    { title: "全栈工程", items: "Python、FastAPI、LangGraph、TypeScript、React、Next.js、Hono、Redis、SSE、Supabase" },
  ],
}

export const experience = [
  { company: "蔚灵深度科技有限公司", role: "Agent / 全栈工程师", location: "杭州", date: "2025.12 — 至今", details: [
    "参与 We0 多智能体 AI Coding 建站与增长平台建设，推动 Supervisor、固定 Workflow、单 Agent 以及 Main / Design Handoff 架构演进。",
    "建立覆盖文本、思考、工具调用、结果、错误、重试、上下文压缩、Question 和 Agent 切换等 29 类事件的协议，基于 Redis Stream + SSE 支持实时推送与历史重放。",
    "构建 E2B 云沙箱、远程文件系统、Shell、Abort、QuickStart 与 MinIO 产物持久化体系；设计多 Agent 并发生成流程，将多页面设计稿生成耗时从 8–12 分钟缩短至 1–4 分钟。",
    "基于 React 18、Razzle、Hono、Supabase 建设全栈建站模板，将 models/*.json 作为数据库、CMS、CRUD 与 API Spec 的单一事实源，自动生成 SQL、类型、校验、CRUD、Route 和 API_SPEC。",
    "基于 Wechatsync 二次开发多渠道内容分发，并搭建豆包账号池与 GEO 自动检测系统，形成内容增长闭环。",
  ] },
  { company: "Pacagen — New York", role: "Software Engineer", location: "New York", date: "2024.10 — 2026.04", details: [
    "主导 Growth Analytics 平台从 0 到 1 落地，围绕用户行为分析、营销转化、A/B Test 与业务数据构建统一分析入口。",
    "设计事件模型与实验分流体系，支持页面访问、商品浏览、加购、Checkout、购买、SSR 实验渲染及转化归因，并使用 ECharts 展示分析结果。",
    "抽象统一邮件接口与模板体系，减少每月约 3,700 美元邮件工具支出；内部化数据分析能力后，每月降低至少 1,000 美元 SaaS 成本。",
    "构建 RAG 客服机器人：结合 256–512 token 文档切分、Embedding、向量召回、BM25、Rerank 和 Shopify Function Calling，支持知识问答、订单查询与转人工。",
    "使用 RAGAS 与人工标注集开展离线评估；将 Shopify Template 官网迁移至 Hydrogen + Remix，并基于 Kling AI + Coze 搭建营销视频生成 Workflow。",
  ] },
]

export const projects = [
  { name: "Insight Copilot", role: "经营数据 Agent · NL2SQL + 归因诊断", date: "Independent project", details: [
    "基于 Shopify 订单与行为事件搭建 ODS、DWD、DWS、ADS 四层数仓，将 GMV、客单价、支付转化率、退款率和复购率等 18 项指标口径写入 YAML 语义层。",
    "使用 Python 跑幂等 T+1 ETL，结合指标召回、SQL 白名单、只读账号、强制 LIMIT 和 5 秒超时，支持同比环比与渠道、品类、地区归因诊断。",
    "用 60 条问句评测集统计执行准确率与结果一致率，并将失败样本按口径误解、多表关联错误和 Schema 歧义回流 few-shot 库。",
  ] },
  { name: "We 校园", role: "微信小程序", date: "2020 — 至今", details: ["参与校园课表、成绩查询及校园社区产品研发，覆盖数十所高校；运营三年累计用户超过 30 万，日活超过 2 万，并建设 GitLab CI/CD、动态主题和小程序动态化引擎。"] },
  { name: "MurmRay", role: "Polymarket AI 机会分析", date: "XLayer Web3 黑客松", details: ["使用 WXT、React、TypeScript、Hono、OpenRouter、InsForge 与 Solidity，实现市场检索、AI 信号判断、链上登记和 active / expired / resolved 结果流转；获一等奖（2,000 USDT）。"] },
  { name: "Agora Space", role: "Multi-Agent 协作学习", date: "AdventureX 2025", details: ["基于 Kimi、Web Speech API、MiniMax TTS、A* 寻路、text-embedding-3-small、pgvector、Durable Objects 与 WebSocket，实现语音访谈、数字人格画像和多 Agent 实时协作；获 AdventureX 二等奖及 BUILD_QUES 新加坡站全球前十。"] },
]
