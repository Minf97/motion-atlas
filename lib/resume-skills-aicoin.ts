import type { ResumeSkill, ResumeProductSkill } from "./resume-skill-sources"

// 技术栈轻量注释
export const frontendStack: ResumeSkill[] = [
  { id: "vue2", term: "Vue 2", project: "Frontend", basis: "stack",
    meaning: { zh: "Vue 2 组件开发", en: "Vue 2 component development" },
    note: { zh: "Vue2 是我最早学的技术栈", en: "Vue 2 was the first tech stack I learned." },
    experience: { zh: "使用 Vue 2 进行组件化界面开发，理解既有项目的组件组织与响应式数据流，并持续维护前端功能。", en: "Used Vue 2 for component-based interfaces, working with component structure and reactive data flow while maintaining frontend features." } },
  { id: "vue3", term: "Vue 3", project: "Frontend", basis: "stack",
    meaning: { zh: "Vue 3 组件开发", en: "Vue 3 component development" },
    note: { zh: "比 React 更优秀更简单的框架，极大地降低使用者的心智负担", en: "To me, Vue 3 is better and simpler than React, with much less mental overhead." },
    experience: { zh: "使用 Vue 3 构建组件化前端界面，与 Vue 2 的既有项目经验一起，覆盖不同版本的 Vue 开发场景。", en: "Used Vue 3 for component-based frontend interfaces, alongside experience with existing Vue 2 projects across different framework versions." } },
  { id: "vite", term: "Vite", project: "Frontend", basis: "stack",
    meaning: { zh: "前端开发与构建工具", en: "Frontend development and build tooling" },
    note: { zh: "学过三元同学的 Vite 底层原理课，不过已经通通忘光了", en: "I took Sanyuan's course on Vite internals, but I've forgotten it all by now." },
    experience: { zh: "使用 Vite 组织前端项目的本地开发与生产构建，将构建工具作为项目交付的一部分，而不只关注页面实现。", en: "Used Vite for local frontend development and production builds, treating build tooling as part of project delivery alongside interface implementation." } },
  { id: "webpack", term: "Webpack", project: "Frontend", basis: "stack",
    meaning: { zh: "前端模块打包", en: "Frontend module bundling" },
    note: { zh: "发现工作里比 Vite 的使用场景多多了", en: "I've found far more uses for Webpack than Vite at work." },
    experience: { zh: "使用 Webpack 处理前端模块与构建流程，具备基于不同构建工具开展开发和维护项目的实际经验。", en: "Worked with Webpack for frontend modules and builds, with practical experience developing and maintaining projects using different build tools." } },
]

// 热点技术要点共用
export const hotspotDetails = [
      { title: { zh: "ECharts 词云与涨跌图形", en: "ECharts word clouds and sentiment shapes" }, detail: { zh: "调整词云字号、密度与排布，实现用于呈现看涨、看跌关系的复杂三角形图形，让 AI 返回的信息能够被直观阅读。", en: "Tuned word-cloud sizing, density and placement, and implemented complex triangular shapes to communicate bullish and bearish views clearly." } },
      { title: { zh: "PWA 本地缓存与再次打开", en: "PWA local caching and repeat visits" }, detail: { zh: "通过 PWA 本地化缓存复用页面资源与已缓存内容，减少第二次打开时的重复加载，优化再次进入的首屏体验。", en: "Used PWA local caching to reuse resources and cached content, reducing repeat loading and improving the first screen on subsequent visits." } },
      { title: { zh: "双板块 Loading 入场编排", en: "Two-panel loading choreography" }, detail: { zh: "让排行榜和详情两个板块从 Loading 平滑过渡到内容。难点在于复杂布局下协调板块尺寸、位置和动画时序，让开场看起来简单自然。", en: "Choreographed both panels from loading into content, coordinating dimensions, positions and timing within a complex layout so the entrance feels simple and natural." } },
      { title: { zh: "多滚动区域与布局边界", en: "Multiple scroll areas and layout boundaries" }, detail: { zh: "页面同时包含榜单、详情与图表等滚动区域，明确各区域的滚动边界，严格控制容器尺寸与溢出关系，避免滚动相互干扰和布局失控。", en: "Managed scrolling across ranking, detail and chart areas, controlling dimensions and overflow boundaries to prevent competing scroll regions and unstable layouts." } },
    ]

// 按案例记录难点
export const aicoinCases: ResumeProductSkill[] = [
  { id: "financial-ui", term: "Financial UI Engineering", project: "AICoin", basis: "aicoin", source: "currency", preview: "currency",
    meaning: { zh: "独立负责的复杂币种详情页", en: "Independently owned currency detail page" },
    experience: { zh: "独立负责 AICoin 币种详情页，是我负责过最复杂的前端业务。页面集合行情图表、实时信息流和大量数据模块，需要同时处理内部金融组件复用、四档响应式布局、多区域滚动衔接，以及庞大接口的接入与业务核对。", en: "Independently owned AICoin's currency detail page, the most complex frontend feature I have delivered. It combines market charts, live feeds and many data modules, bringing together reusable financial components, four responsive ranges, coordinated scrolling and extensive API integration and business-rule verification." },
    details: [
      { title: { zh: "内部金融组件库", en: "Internal financial component library" }, detail: { zh: "构建符合公司设计规范的内部金融组件，将表格、带特殊货币符号的数值与涨跌显示等重复需求沉淀为可复用组件，支持复杂金融页面的快速搭建，并保持视觉和数据展示规范一致。", en: "Built reusable financial components aligned with the company's design standards, including tables and price/change displays with special currency symbols, enabling faster assembly of complex pages with consistent styling and data presentation." } },
      { title: { zh: "四档响应式设计", en: "Four responsive layout ranges" }, detail: { zh: "按超大屏 1550px+、普通 PC 1280px+、大平板 780px+、小平板 480px+ 四个尺寸区域调整布局与内容排布，让高密度金融信息在不同屏幕尺寸下仍有良好的阅读与操作体验。", en: "Adapted layout and content across four ranges: extra-wide screens at 1550px+, desktop at 1280px+, large tablets at 780px+ and small tablets at 480px+, keeping dense financial information readable and usable across screen sizes." } },
      { title: { zh: "CSS Grid 与滚动衔接", en: "CSS Grid and scroll chaining" }, detail: { zh: "使用 CSS Grid 组织左、中、右三个可滚动区域。左右侧栏滚动到底后，继续滚动会衔接到中间主区域，避免指针停在侧栏时出现页面滚不动的体验，兼顾复杂布局与连续浏览。", en: "Used CSS Grid for left, center and right scrollable regions. When either sidebar reaches its bottom, continued scrolling carries into the central content instead of trapping the user's scroll inside the sidebar." } },
      { title: { zh: "复杂业务与实时数据协同", en: "Complex business logic and live data" }, detail: { zh: "在同一页面协调图表渲染、WebSocket 实时信息流更新、分页加载和虚拟列表；面对数量庞大的接口，逐项核对数据字段、模块需求与业务口径，完成多个数据模块的接入和联调。", en: "Coordinated chart rendering, WebSocket live-feed updates, pagination and virtualized lists on one page. Integrated numerous APIs and verified fields, module requirements and business definitions across the different data sections." } },
    ] },
  { id: "news-feed", term: "Real-time News Feed", project: "AICoin", basis: "aicoin", source: "news", preview: "news",
    meaning: { zh: "资讯流、WebSocket 与分页加载", en: "News feeds, WebSocket updates and pagination" },
    experience: { zh: "负责 AICoin 资讯页及快讯相关前端功能，处理客户端旧接口迁移到 Web 的兼容问题，让实时新消息和历史分页在同一个列表中平稳衔接。", en: "Owned frontend work on AICoin's news page and related flash-news features, adapting legacy client APIs for the web and combining live updates with paginated history." },
    details: [
      { title: { zh: "客户端旧接口兼容", en: "Legacy client API compatibility" }, detail: { zh: "快速迭代中接口文档缺失，请求方式复杂，一个大接口里混合了约 20–30 个字段。逐项梳理字段与请求逻辑，调整客户端接口在 Web 环境中的调用和数据映射。", en: "Incomplete documentation, complex request patterns and roughly 20–30 fields made the legacy endpoint difficult to reuse. Mapped its fields and request logic, adapting client-oriented calls and responses for the web." } },
      { title: { zh: "WebSocket 顶部增量更新", en: "Animated WebSocket prepends" }, detail: { zh: "接收 WebSocket 推送的新资讯，从列表顶部补入，并用过渡动效衔接位置变化，让更新可感知，避免内容突然跳入的生硬感。", en: "Prepended incoming WebSocket news and animated list position changes, making fresh content noticeable without abrupt jumps." } },
      { title: { zh: "历史资讯分页加载", en: "Paginated news history" }, detail: { zh: "实现历史资讯分页加载，协调向前补入的新消息与继续加载的旧内容，让实时更新和历史阅读在同一列表中有序衔接。", en: "Implemented pagination for older entries, coordinating live prepends with loading history so updates and earlier content fit into one coherent feed." } },
    ] },
  { id: "ai-hotspots", term: "ECharts / AI Visualization", project: "AICoin", basis: "aicoin", source: "desktop", preview: "hotspots",
    meaning: { zh: "Electron 热点排行榜与 AI 解读", en: "Electron hotspot rankings and AI analysis" },
    experience: { zh: "在 Electron 客户端实现热点排行榜与 AI 解读界面，重点处理 ECharts 复杂可视化、PWA 本地缓存、双板块开场动效，以及多滚动区域的布局与体验。", en: "Built the Electron interface for hotspot rankings and AI analysis, focusing on ECharts, PWA local caching, two-panel entrance animations and multiple scroll areas." },
    details: hotspotDetails },
  { id: "ssg-markdown", term: "SSG / Markdown", project: "AICoin", basis: "aicoin", source: "aiscript", preview: "aiscript",
    meaning: { zh: "静态生成的脚本文档站", en: "Statically generated script documentation" },
    experience: { zh: "负责 AIScript 函数文档前端，采用 SSG 生成页面，兼容 Next.js 8 老项目接口，并由同一份接口数据组织左侧菜单与右侧 Markdown 内容。", en: "Built the AIScript reference frontend with SSG, integrating a legacy Next.js 8 API and using fetched data for both the sidebar and Markdown content." },
    details: [
      { title: { zh: "Next.js 8 旧接口接入", en: "Integrating the Next.js 8 API" }, detail: { zh: "通过兼容路径调用 Next.js 8 老项目提供的接口，调整请求与返回数据的衔接方式，将旧内容接入静态生成流程。", en: "Called endpoints exposed by the older Next.js 8 project through a compatibility path, adapting requests and responses for static generation." } },
      { title: { zh: "数据驱动菜单与 Markdown 兼容", en: "Data-driven menus and Markdown compatibility" }, detail: { zh: "根据接口数据直接渲染侧边栏 Menu，右侧以 Markdown 展示函数说明与示例，并兼容历史内容中的特殊格式，让目录与正文保持对应。", en: "Rendered the sidebar menu from API data and displayed descriptions and examples as Markdown, supporting special legacy formats while keeping navigation aligned with the content." } },
    ] },
]
