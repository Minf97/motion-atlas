export type BilingualText = { zh: string; en: string }
type SkillExperience = {
  id: string
  term: string
  meaning: BilingualText
  project: "AICoin" | "Pacagen" | "We0" | "Motion Atlas" | "Frontend" | "Backend"
  experience: BilingualText
  basis: keyof typeof experienceSources
}
export type ResumeProductSkill = SkillExperience & {
  source: keyof typeof skillSources
  preview: keyof typeof skillPreviews
  gallery?: (keyof typeof skillPreviews)[]
  details?: { title: BilingualText; detail: BilingualText }[]
  note?: never
}
export type ResumeTextSkill = SkillExperience & {
  source?: keyof typeof skillSources
  preview?: never
  details?: { title: BilingualText; detail: BilingualText }[]
  note?: never
}
export type ResumeSkill = ResumeProductSkill | ResumeTextSkill | (SkillExperience & { note: BilingualText; source?: never; preview?: never })
export type ResumeSkillGroup = {
  id: string
  title: string
  titleEn: string
  items: ResumeSkill[]
}

// 区分经历与官网
export const experienceSources = {
  product: "用户补充 · PostHog 埋点与漏斗、AI 产品术语、定价和收费体系；内部看板未公开",
  ui: "用户补充 · Framer Motion 动效库、Figma 设计工具",
  backend: "用户补充 · 后端技术、课程经历与服务部署实践；未填写经历的术语仅提供技术释义",
  stack: "用户补充 · Vue 2、Vue 3、Vite、Webpack；未指定各工具对应的具体项目",
  aicoin: "agent-api/knowledge/experience.md 与用户项目补充 · K 线 SDK、Electron、资讯流、AIScript、独立负责币种详情页",
  pacagen: "lib/resume.ts、agent-api/knowledge/experience.md · Shopify Headless、Growth Analytics、RAG 客服、营销工作流",
  we0: "lib/resume.ts、agent-api/knowledge/experience.md · Agent 架构、设计画布、模板、全栈生成、增长分发",
  brief: "用户提供 pasted-text-1.txt · 自然流量分析、私域转化、AIGC 内容与 CMS 工作流",
  portfolio: "components/resume-cursor.tsx、lib/spline-works.ts · 光标交互、主题、页面转场与 Spline 作品",
} as const

export const skillSources = {
  pricing: {
    url: "https://we0.ai/zh/pricing", title: { zh: "We0 · 价格方案", en: "We0 · Pricing" },
    observation: { zh: "公开页展示订阅、原价与优惠价及 CUSTOM 定制方案；早鸟价与成本考量来自用户补充，不使用当前页面截图代替早鸟方案。", en: "The public page shows subscriptions, original and discounted prices, and CUSTOM plans. Historical early-bird pricing and cost considerations are user-provided, with no substitute screenshot." },
    scope: "public-feature", checkedOn: "2026-11-22",
  },
  currency: {
    url: "https://www.aicoin.com/zh-Hans/currencies/bitcoin", title: { zh: "AICoin · 币种详情页", en: "AICoin · Currency details" },
    observation: { zh: "公开页面展示币种信息、行情、图表与社区内容；独立负责范围、组件库、响应式断点及滚动实现由用户补充。", en: "The public page shows coin information, markets, charts and community content; ownership, component-library work, responsive breakpoints and scroll behavior are described by the user." },
    scope: "public-feature", checkedOn: "2026-11-22",
  },
  chart: {
    url: "https://www.aicoin.com/zh-Hans#features", title: { zh: "AICoin · K 线图表", en: "AICoin · Candlestick charts" },
    observation: { zh: "官网「简单易用的 K 线图表」区域有图表入口。", en: "The homepage has a candlestick-chart section and a chart entry point." },
    scope: "public-feature", checkedOn: "2026-11-21",
  },
  desktop: {
    url: "https://www.aicoin.com/zh-Hans#web3", title: { zh: "AICoin · 客户端与实时行情", en: "AICoin · Desktop and market data" },
    observation: { zh: "首屏展示行情分析与客户端下载入口；具体实现来自既有经历。", en: "The hero presents market analysis and a client download; implementation details come from the recorded experience." },
    scope: "public-feature", checkedOn: "2026-11-21",
  },
  downloads: {
    url: "https://www.aicoin.com/zh-Hans", title: { zh: "AICoin · 客户端下载弹窗", en: "AICoin · Client download dialog" },
    observation: { zh: "用户截图展示芯片选择、分步说明和由暗到亮的界面层次。", en: "The supplied screenshot shows chip choices, paired instructions and progressively lighter surfaces." },
    scope: "user-capture", checkedOn: "2026-11-21",
  },
  news: {
    url: "https://www.aicoin.com/zh-Hans/news/all", title: { zh: "AICoin · 资讯中心", en: "AICoin · News center" },
    observation: { zh: "公开资讯列表；旧接口、WebSocket 与分页实现由用户补充。", en: "Public news listing; legacy API, WebSocket and pagination work is described by the user." },
    scope: "public-feature", checkedOn: "2026-11-21",
  },
  aiscript: {
    url: "https://www.aicoin.com/zh-Hans/aiscript-reference/high?lang=cn", title: { zh: "AICoin · AIScript 文档", en: "AICoin · AIScript reference" },
    observation: { zh: "左侧函数菜单，右侧函数说明与代码示例；SSG 和旧接口实现由用户补充。", en: "Function navigation beside descriptions and examples; SSG and legacy API implementation are user-provided experience." },
    scope: "public-feature", checkedOn: "2026-11-21",
  },
  commerce: {
    url: "https://pacagen.com/en-us/products/cat-allergen-neutralizing-spray", title: { zh: "Pacagen · 商品购买区", en: "Pacagen · Product purchase flow" },
    observation: { zh: "商品页可选择香型、配送周期和订阅/单次购买，并加入购物车。", en: "The product page offers scent and delivery choices, subscription or one-time purchase, and add-to-cart." },
    scope: "public-feature", checkedOn: "2026-11-21",
  },
  pacagen: {
    url: "https://pacagen.com/en-us/", title: { zh: "Pacagen · 官网与客服入口", en: "Pacagen · Storefront and support" },
    observation: { zh: "可见商品、活动、FAQ 和客服入口；内部分析与 RAG 实现不对外展示。", en: "Products, offers, FAQs and a chat entry are public; internal analytics and RAG implementation are not exposed." },
    scope: "product-context", checkedOn: "2026-11-21",
  },
  agents: {
    url: "https://we0.ai/zh/agent-team", title: { zh: "We0 · 多 Agent 协作", en: "We0 · Multi-agent collaboration" },
    observation: { zh: "官方介绍需求、PM、设计、开发和部署的角色交接流程。", en: "The official page describes handoffs across planning, PM, design, development and deployment." },
    scope: "public-feature", checkedOn: "2026-11-21",
  },
  design: {
    url: "https://we0.ai/zh/design-to-code", title: { zh: "We0 · Figma / Sketch 还原", en: "We0 · Design-to-code" },
    observation: { zh: "设计导入保留选区截图、尺寸、文字、样式与图层树，再生成项目页面。", en: "Design import carries selected previews, dimensions, text, styles and layers into generated pages." },
    scope: "public-feature", checkedOn: "2026-11-21",
  },
  cms: {
    url: "https://we0.ai/zh/cms-backend", title: { zh: "We0 · CMS 后台", en: "We0 · CMS backend" },
    observation: { zh: "官方列出 CRUD、富文本、图片和文件上传，面向内容维护与数据管理。", en: "The page lists CRUD, rich text, image and file uploads for content and data management." },
    scope: "public-feature", checkedOn: "2026-11-21",
  },
  geo: {
    url: "https://we0.ai/zh/seo-geo-optimization", title: { zh: "We0 · SEO 与 GEO", en: "We0 · SEO and GEO" },
    observation: { zh: "官方说明多语言 metadata、规范链接及搜索与 AI 结果可见性基础。", en: "The page covers localized metadata, canonical links and foundations for search and AI visibility." },
    scope: "public-feature", checkedOn: "2026-11-21",
  },
  growth: {
    url: "https://we0.ai/zh", title: { zh: "We0 · 增长工作台", en: "We0 · Growth workspace" },
    observation: { zh: "首页增长工作台介绍搜索优化、内容生产、效果分析与执行链路。", en: "The homepage presents search optimization, content production, analytics and growth execution." },
    scope: "public-feature", checkedOn: "2026-11-21",
  },
  portfolio: {
    url: "/spline/3d-calculator/", title: { zh: "本站 · Spline 作品", en: "This portfolio · Spline work" },
    observation: { zh: "可直接查看 3D Calculator，另有 3D Keyboard 和页面交互动效。", en: "View 3D Calculator, alongside 3D Keyboard and the site's interaction studies." },
    scope: "local-work", checkedOn: "2026-11-21",
  },
} as const

// 功能区截图预览
export const skillPreviews = {
  currency: { image: "/images/skill-previews/currency.webp", label: { zh: "币种信息、行情与社区多栏布局", en: "Coin information, markets and community layout" } },
  chart: { image: "/images/skill-previews/chart.webp", label: { zh: "K 线工具与行情图表", en: "Chart tools and market data" } },
  desktop: { image: "/images/skill-previews/desktop.webp", label: { zh: "AICoin 桌面与移动端", en: "AICoin desktop and mobile apps" } },
  "desktop-news": { image: "/images/skill-previews/desktop-news.webp", label: { zh: "Electron 快讯工作区", en: "Electron news workspace" } },
  "desktop-chart": { image: "/images/skill-previews/desktop-chart.webp", label: { zh: "Electron 行情与交易工作区", en: "Electron market and trading workspace" } },
  news: { image: "/images/skill-previews/news.webp", label: { zh: "资讯列表与分类导航", en: "News listing and category navigation" } },
  hotspots: { image: "/images/skill-previews/hotspots.webp", label: { zh: "热点排行榜、情绪图表与词云", en: "Hotspot rankings, sentiment charts and word cloud" } },
  aiscript: { image: "/images/skill-previews/aiscript.webp", label: { zh: "函数菜单、Markdown 与示例", en: "Function menu, Markdown and examples" } },
  elevation: { image: "/images/skill-previews/aicoin-download.webp", label: { zh: "背景、弹窗与内容区的明度层级", en: "Surface hierarchy across backdrop, dialog and content" } },
  "data-driven": { image: "/images/skill-previews/aicoin-download.webp", label: { zh: "横向排列的分步说明", en: "Data-driven rows of paired instructions" } },
  commerce: { image: "/images/skill-previews/commerce.webp", label: { zh: "香型、周期和订阅购买选项", en: "Scent, frequency and subscription options" } },
  pacagen: { image: "/images/skill-previews/pacagen.webp", label: { zh: "Pacagen 商品与品牌首页", en: "Pacagen storefront and brand page" } },
  support: { image: "/images/skill-previews/support.webp", label: { zh: "客服问答与订单查询入口", en: "Support questions and order lookup" } },
  agents: { image: "/images/skill-previews/agents.webp", label: { zh: "需求到部署的多角色交接", en: "Multi-agent handoffs from planning to deployment" } },
  design: { image: "/images/skill-previews/design.webp", label: { zh: "Figma 和 Sketch 选区还原", en: "Figma and Sketch selection workflow" } },
  cms: { image: "/images/skill-previews/cms.webp", label: { zh: "CRUD、富文本及资源上传", en: "CRUD, rich text and asset uploads" } },
  geo: { image: "/images/skill-previews/geo.webp", label: { zh: "多语言 SEO 与 metadata", en: "Multilingual SEO and metadata" } },
  growth: { image: "/images/skill-previews/growth.webp", label: { zh: "内容、分析和 GEO 增长工作台", en: "Content, analytics and GEO workspace" } },
  portfolio: { image: "/images/skill-previews/portfolio.webp", label: { zh: "3D Calculator Spline 场景", en: "3D Calculator Spline scene" } },
} as const
