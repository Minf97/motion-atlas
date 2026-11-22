import type { BilingualText, skillPreviews } from "./resume-skill-sources"

type PreviewNote = { width: number; height: number; x: number; y: number; detail: BilingualText; provenance?: BilingualText }

// 标注真实功能位置
export const previewNotes: Record<keyof typeof skillPreviews, PreviewNote> = {
  currency: { width: 1280, height: 720, x: 53, y: 57, detail: {
    zh: "这是我独立负责的币种详情页。左侧币种信息、中间行情与数据、右侧社区内容形成高密度多栏工作区；下方展开组件库、响应式、滚动衔接和实时业务的具体实现。",
    en: "This is the currency detail page I independently owned. Coin information, central market data and community content share a dense multi-column workspace. The notes below cover components, responsive layouts, scroll chaining and live-data integration.",
  }, provenance: { zh: "官网区域截图 · 2026.11.22 · 点击图片放大", en: "Website capture · 2026-11-22 · Click image to zoom" } },
  news: { width: 1280, height: 720, x: 42, y: 52, detail: {
    zh: "负责资讯页与快讯相关功能。公开页面展示分类与资讯列表，下面展开的是跨端旧接口适配、WebSocket 新消息动效和历史分页三项实现难点。",
    en: "I owned news and related flash-feed frontend features. This public capture shows categories and entries; the implementation notes cover API adaptation, animated live updates and history pagination.",
  } },
  aiscript: { width: 1280, height: 720, x: 21, y: 40, detail: {
    zh: "菜单选择 high 后，右侧展示说明、返回值与代码示例。目录和正文由接口数据驱动；SSG、Next.js 8 兼容与特殊 Markdown 格式属于我的实现工作。",
    en: "Selecting high reveals its description, return value and examples. API data drives the menu and content; SSG, Next.js 8 compatibility and special Markdown formatting are my implementation work.",
  } },
  hotspots: { width: 1470, height: 804, x: 77, y: 63, detail: {
    zh: "后端爬取资讯并清洗，通过向量余弦相似度匹配币种相关内容，整理上下文交给 AI 生成看涨看跌、概况、解析和词云，再存入 Redis 复用。我的前端工作侧重将这些结果组织为可交互的客户端界面。",
    en: "The backend crawls and cleans news, matches coin-related content with vector cosine similarity, sends assembled context to AI for sentiment, summaries, analysis and word clouds, then caches results in Redis. My frontend work presents these results as an interactive client interface.",
  }, provenance: { zh: "用户提供的 Electron 截图 · 点击图片放大", en: "User-supplied Electron capture · Click image to zoom" } },
  "desktop-news": { width: 1470, height: 804, x: 58, y: 39, detail: {
    zh: "快讯时间线与右侧热点、币种及事件日历同屏展示。截图用于展示我参与的 Electron 客户端场景；实时消息、接口兼容和分页细节可查看 Real-time News Feed。",
    en: "The news timeline sits beside hotspots, coin information and an event calendar. This shows the Electron client context; Real-time News Feed explains live updates, API compatibility and pagination.",
  }, provenance: { zh: "用户提供的 Electron 截图 · 点击图片放大", en: "User-supplied Electron capture · Click image to zoom" } },
  "desktop-chart": { width: 1470, height: 804, x: 52, y: 44, detail: {
    zh: "自选列表、K 线画布、盘口与成交明细组成桌面工作区。这张图补充客户端的多栏场景，K 线维护与双 Canvas 重绘优化详见 Canvas Rendering。",
    en: "Watchlists, candlestick canvas, order book and recent trades share a desktop workspace. Canvas Rendering covers KlineChart maintenance and dual-Canvas redraw optimization.",
  }, provenance: { zh: "用户提供的 Electron 截图 · 点击图片放大", en: "User-supplied Electron capture · Click image to zoom" } },
  chart: { width: 1208, height: 510, x: 55, y: 42, detail: {
    zh: "看图中的 K 线、指标工具栏与行情反馈。我的实践是把行情数据接入 Canvas 图表，并组织成可复用的 React SDK。",
    en: "Look at the candles, indicator toolbar and market feedback. My work connected market data to Canvas charts through a reusable React SDK.",
  } },
  desktop: { width: 1208, height: 560, x: 36, y: 40, detail: {
    zh: "电脑端把多张图表、行情列表和分析工具集中在一个工作区，对应我参与的 Electron 客户端开发场景。",
    en: "The desktop workspace combines multiple charts, market lists and analysis tools—the product context for my Electron client work.",
  } },
  elevation: { width: 1354, height: 1200, x: 52, y: 44, detail: {
    zh: "黑色背景、深灰弹窗、再亮一层的说明卡片，形成三层表面。这里用的是明度层级：越靠近阅读焦点的表面越亮，让用户自然感知容器关系。",
    en: "The black backdrop, dark-gray dialog and brighter instruction card form three surfaces. Increasing brightness toward the reading focus makes their nesting easier to perceive.",
  }, provenance: { zh: "用户提供的 AICoin 截图 · 点击图片放大", en: "User-supplied AICoin capture · Click image to zoom" } },
  "data-driven": { width: 1354, height: 1200, x: 53, y: 53, detail: {
    zh: "看说明区横向排列的步骤：每项都由序号、文案与配图组成。我将这些内容放进数组对象，由列表渲染复用同一套结构；截图展示效果，具体实现来自我的项目实践。",
    en: "Each paired instruction uses a number, text and image. I stored these entries in an array of objects and rendered them with one shared structure. The screenshot shows the result; the implementation description comes from my project work.",
  }, provenance: { zh: "用户提供的 AICoin 截图 · 点击图片放大", en: "User-supplied AICoin capture · Click image to zoom" } },
  commerce: { width: 575, height: 452, x: 50, y: 18, detail: {
    zh: "从香型选择到配送周期，再到订阅方案，是可观察的购买决策链路。我围绕这些环节连接商品数据、行为事件与转化分析。",
    en: "Scent, delivery frequency and subscription choices form an observable purchase journey. My work connects product data, behavioral events and conversion analysis around these steps.",
  } },
  pacagen: { width: 1070, height: 380, x: 11, y: 83, detail: {
    zh: "从首页的 Shop Now 进入商品和购买流程，是增长分析追踪的公开用户路径。截图展示业务场景，内部数据平台和内容生产工具不在官网公开。",
    en: "The Shop Now entry leads from the homepage into shopping—the public user journey behind growth analysis. This is product context; internal analytics and content tooling are not public.",
  } },
  support: { width: 500, height: 420, x: 40, y: 56, detail: {
    zh: "客服窗口直接提供商品问答、Track order status 和人工联系入口，对应知识检索、订单查询与转人工三个业务分支。截图仅展示公开界面。",
    en: "The support window exposes product questions, Track order status and a human-service entry, matching knowledge retrieval, order lookup and handoff. This capture shows the public interface only.",
  } },
  agents: { width: 1090, height: 425, x: 49, y: 78, detail: {
    zh: "看下方 Leader → PM → 设计 → 开发 → 运维的角色分工。我的编排与上下文管理工作，让不同角色承接上一阶段的产物并继续交付。",
    en: "The roles run from Leader and PM through design, development and operations. My orchestration and context work connects each role to the previous stage's deliverables.",
  } },
  design: { width: 1090, height: 405, x: 61, y: 82, detail: {
    zh: "重点在“截图和结构一起带走”：选区不仅包含效果图，还保留尺寸、文字、样式和图层树，供后续页面生成与预览使用。",
    en: "The key is carrying structure with the screenshot: selected dimensions, text, styles and layers travel into page generation and preview.",
  } },
  cms: { width: 1090, height: 365, x: 12, y: 76, detail: {
    zh: "后台 CRUD、富文本与资源上传是运营真正使用的入口。我的工作将这些数据维护能力与全栈模板、接口和前台展示衔接。",
    en: "CRUD, rich text and uploads are the day-to-day editing entry points. My work connects this data maintenance with full-stack templates, APIs and frontend views.",
  } },
  geo: { width: 1090, height: 535, x: 30, y: 80, detail: {
    zh: "看下方 metadata、规范链接和语言映射。它们为搜索理解提供基础；GEO 检测与内容增长则属于我的相关项目实践，不代表截图展示了内部检测结果。",
    en: "Metadata, canonical links and language mappings form the search foundation. GEO checks and content growth are related project work; this capture does not show internal detection results.",
  } },
  growth: { width: 1080, height: 535, x: 71, y: 43, detail: {
    zh: "右侧工作台把内容、GEO 和分析等能力放在同一入口。我的实践侧重内容分发、账号池和交付衔接，串起生成之后的运营流程。",
    en: "The workspace brings content, GEO and analytics into one entry point. My contribution focuses on publishing, account pools and delivery handoffs after generation.",
  } },
  portfolio: { width: 1090, height: 455, x: 46, y: 45, detail: {
    zh: "这是我制作的 3D Calculator 实际运行画面。可以在本站 Spline 作品页操作场景，也能查看 3D Keyboard、主题和页面转场。",
    en: "This is my running 3D Calculator scene. Open the Spline work to interact with it, alongside 3D Keyboard, theme changes and page transitions.",
  } },
}
