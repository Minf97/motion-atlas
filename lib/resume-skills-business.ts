import type { ResumeSkillGroup } from "./resume-skill-sources"
import { productSkills } from "./resume-skills-product.ts"

// 用业务经历解释术语
export const businessSkills: ResumeSkillGroup[] = [
  { id: "product", title: "产品经理", titleEn: "Product Management", items: [
    ...productSkills.slice(0, 2),
    { id: "growth-analytics", term: "Growth Analytics", meaning: { zh: "增长数据产品", en: "Growth data products" }, project: "Pacagen", basis: "pacagen",
      experience: { zh: "建设 Growth Analytics 与实验分析能力，从行为事件到转化归因形成统一数据入口；内部化分析能力每月节省至少 1,000 美元 SaaS 成本。", en: "Built Growth Analytics and experimentation capabilities from behavioral events to attribution, reducing SaaS costs by at least $1,000 per month through internal analytics." } },
    { id: "user-journey", term: "User Journey Mapping", meaning: { zh: "用户路径拆解", en: "Mapping the user's path" }, project: "Pacagen", basis: "pacagen", source: "commerce", preview: "commerce",
      experience: { zh: "围绕官网浏览、商品选择与购买行为建立分析入口，将用户操作路径拆为可观察的事件与转化环节，帮助定位流程问题。", en: "Organized browsing, product-selection and purchasing behavior into observable events and conversion stages to investigate friction in the user journey." } },
    { id: "ab-testing", term: "实验分析", meaning: { zh: "A/B Testing · Experiment Design", en: "A/B Testing · Experiment Design" }, project: "Pacagen", basis: "pacagen",
      experience: { zh: "参与电商 A/B Testing 与 Experiment Design，用用户行为和转化数据比较产品方案；实验配置与结果属于内部分析，不用商品页图片代替实验看板。", en: "Worked on ecommerce A/B Testing and Experiment Design, comparing product variants through behavioral and conversion data. Internal experiment configurations and results are described without substitute product screenshots." } },
    { id: "agent-product", term: "Agent Workflow Design", meaning: { zh: "面向交付的 Agent 产品流程", en: "Agent workflows designed around delivery" }, project: "We0", basis: "we0", source: "agents", preview: "agents",
      experience: { zh: "参与把自然语言需求连接到设计、代码、后台和预览的产品流程，让 Agent 最终交付可运行项目，而不止返回一段对话。", en: "Helped connect natural-language requirements with design, code, backends and previews so the agent delivers a working project rather than only a chat response." } },
    ...productSkills.slice(2),
  ] },
  { id: "marketing", title: "市场营销", titleEn: "Marketing", items: [
    { id: "cro", term: "Conversion Rate Optimization", meaning: { zh: "转化路径优化与分析", en: "Conversion-path analysis and optimization" }, project: "Pacagen", basis: "pacagen", source: "commerce", preview: "commerce",
      experience: { zh: "在 Growth Analytics 中分析用户行为、转化漏斗与实验结果，找出购买路径中的流失环节，为商品页和购买流程优化提供数据依据。", en: "Analyzed behavior, conversion funnels and experiments in Growth Analytics to identify drop-off points and inform product-page and purchase-flow improvements." } },
    { id: "geo", term: "GEO / AI Search Visibility", meaning: { zh: "生成式搜索可见性", en: "Visibility in generative search" }, project: "We0", basis: "we0", source: "geo",
      experience: { zh: "参与 We0 项目的 SEO / GEO 工作，从代码与外部内容两侧提升网站的搜索可见性。", en: "Worked on SEO and GEO for We0, improving website visibility through both code-level changes and external content." },
      details: [
        { title: { zh: "站内 SEO / GEO 技术优化", en: "On-site SEO / GEO implementation" }, detail: { zh: "从代码层面优化项目，包括 metadata 等页面信息，帮助搜索引擎与 AI 系统理解页面主题和内容结构。", en: "Improved the project at code level, including metadata and page information, to help search engines and AI systems understand page topics and structure." } },
        { title: { zh: "外链与网站信任", en: "Backlinks and site trust" }, detail: { zh: "从站外建设相关外链，提升网站在行业中的可信度与权重。", en: "Built relevant external links to strengthen the website's credibility and authority in its field." } },
        { title: { zh: "内容发布与关键词布局", en: "Content publishing and keyword strategy" }, detail: { zh: "策划并发布相关文章，结合软性产品介绍提升网站知名度；围绕核心词与长尾词布局内容，争取提高搜索引擎和 AI 答案中的可见性。", en: "Planned and published relevant articles with contextual product mentions, building awareness while targeting core and long-tail keywords to improve visibility in search and AI answers." } },
      ] },
    { id: "content-automation", term: "AI Content Automation", meaning: { zh: "AI 营销内容自动化", en: "AI-assisted marketing content" }, project: "Pacagen", basis: "brief",
      experience: { zh: "参与 AI 营销内容生产流程，将重复的内容制作步骤整理成更易复用的工作方式，支持团队持续产出营销素材。", en: "Helped shape an AI-assisted marketing content workflow, making repeated production steps easier to reuse and helping the team produce marketing assets consistently." } },
    { id: "aigc", term: "AIGC", meaning: { zh: "AI 视频与本地图像生成", en: "AI video and local image generation" }, project: "Pacagen", basis: "brief",
      experience: { zh: "使用可灵 AI（Kling AI）制作 AI 视频，并在本地使用 Stable Diffusion 生成图片，通过 ComfyUI 的节点工作流编排图像生成过程。", en: "Used Kling AI to create AI videos and Stable Diffusion to generate images locally, arranging the image-generation process through ComfyUI's node-based workflows." } },
  ] },
  { id: "operations", title: "运营", titleEn: "Operations", items: [
    { id: "distribution", term: "Content Distribution", meaning: { zh: "多渠道内容分发", en: "Multi-channel content distribution" }, project: "We0", basis: "we0", source: "growth", preview: "growth",
      experience: { zh: "参与多渠道分发与账号池建设，衔接内容生产、发布和增长执行，减少运营流程中的重复操作。", en: "Worked on multi-channel publishing and account pools, connecting content production with publishing and growth execution to reduce repeated operational work." } },
    { id: "cms-workflow", term: "CMS / Content Workflow", meaning: { zh: "内容管理与运营流程", en: "Content management and editorial workflows" }, project: "We0", basis: "we0", source: "cms", preview: "cms",
      experience: { zh: "参与数据后台和全栈模板链路，将内容维护接入生成项目；对应官网的 CRUD、富文本与资源上传能力，让运营可继续更新内容。", en: "Connected data backends and full-stack templates to generated projects, enabling ongoing content maintenance through CMS CRUD, rich text and asset uploads." } },
    { id: "support-operations", term: "Customer Support Automation", meaning: { zh: "客服自动化与人工交接", en: "Support automation and human handoff" }, project: "Pacagen", basis: "pacagen", source: "pacagen", preview: "support",
      experience: { zh: "建设支持知识问答、订单查询与转人工的客服机器人，帮助用户自助解决常见问题，并在需要时连接人工支持。", en: "Built a support bot for knowledge questions and order lookups, helping customers resolve common issues and connect with a human when needed." } },
    { id: "commercial-ops", term: "Commercial Operations", meaning: { zh: "私域转化与商业交付", en: "Private-channel conversion and delivery" }, project: "We0", basis: "brief", source: "growth", preview: "growth",
      experience: { zh: "围绕已有私域用户需求，参与建站、GEO 服务和交付方案的组织，将用户商业化需求与产品能力、后续交付连接起来。", en: "Helped connect existing private-channel users' commercial needs with site-building, GEO services and delivery plans, linking product capabilities to ongoing service." } },
  ] },
]
