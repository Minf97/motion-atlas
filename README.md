# Motion Atlas

一个使用 Next.js 16、React 19、shadcn/ui 与 Lenis 制作的交互特效作品集。首页按 **Loading / Scrolling / Smooth Scrolling** 建立三级目录，点击条目进入独立演示，也可从目录直接查看原站。

## 本地运行

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`。首次进入会播放 Splash；每个演示页均可单独访问，例如 `/effects/image-reveal`。

## Personal Agent

Agent 页面位于 `/agent/`，需要独立运行 `agent-api/`。前端构建时设置 `NEXT_PUBLIC_AGENT_API_URL` 为已部署的 API 地址；GitHub Pages 使用仓库 Variables 中的同名变量。本地运行时也可使用 `NEXT_PUBLIC_AGENT_API_URL=http://localhost:8000 npm run dev`。

## Bilibili 同时在看榜

排行榜位于 `/bilibili/`，英文页面位于 `/en/bilibili/`，复用 `agent-api/`。后台采集器从 B 站科技（188）和生活（160）分区排行榜各发现最多 100 条候选，按单队列逐条读取播放器在线人数并写入 Redis；网页刷新只读取 Redis。每条视频显示最近成功观测时间，超过新鲜度窗口的数据会从榜单排除。手动刷新只重新读取缓存，不会触发 B 站请求。接口为 `GET /bilibili/ranking?category=technology|life`，缩略图经限制在 `*.hdslb.com` 的图片代理提供。

Render 后端需要配置外部 Upstash Redis 的 `REDIS_URL`。Upstash 控制台提供的 `rediss://` 地址可以直接使用。采集配置可选：`BILIBILI_SAMPLE_INTERVAL_SECONDS`（默认每个上游 HTTP 请求间隔 4 秒）、`BILIBILI_DISCOVERY_INTERVAL_SECONDS`（默认 900 秒）、`BILIBILI_COOLDOWN_SECONDS`（默认 1800 秒）、`BILIBILI_MAX_AGE_SECONDS`（默认 1800 秒）。频率不代表 B 站承诺的安全阈值；遇到 `-352/-412/-429` 或 HTTP 403/412/429 时采集器停止请求并进入冷却。

### Render 部署

仓库根目录的 `render.yaml` 是 Render Blueprint。创建 Blueprint 时选择本仓库，Render 会使用 `agent-api/` 下的 Dockerfile 创建 Web Service。部署前在 Render 环境变量中填写模型密钥、`REDIS_URL` 和 `AGENT_ALLOWED_ORIGINS`。Redis 使用 Upstash，简历和知识文档随镜像发布；不要把 API 密钥或 Redis 地址提交到仓库。

免费 Web Service 会休眠。使用 cron-job.org 或 UptimeRobot 每 10 分钟请求一次 `https://<render-service>.onrender.com/health`，只保活这一个服务；不要为同一项目再创建第二个免费 Web Service。

部署完成后，把 Render 服务地址设置为 GitHub 仓库变量 `NEXT_PUBLIC_AGENT_API_URL`，然后重新运行 Pages workflow。前端调用 `/workspace`、`/chat`、`/bilibili/ranking` 和 `/bilibili/cover`，后端的 `AGENT_ALLOWED_ORIGINS` 必须包含 `https://minf97.github.io`。

## GitHub Pages

推送到 `main` 后，`.github/workflows/deploy-pages.yml` 会自动构建并发布静态站点。仓库需要在 Settings → Pages → Source 中选择 GitHub Actions；项目站点地址为 `https://<用户名>.github.io/motion-atlas/`。

## 案例

- Loading：Lusion Splash；Amaterasu 遮罩、Jealous Films 交叠、Ruba 共享元素
- Scrolling：Lusion 滚动触发；Filmbot 图片裁剪、Spire 遮罩、Kaito Note 视频帧、Inkfish 横向位移、Scale & Form 镜头、Noomo Labs 模型、Lawted 场景、Hung Design Studio 视差
- Smooth Scrolling：Lenis 与原生滚动对比，以及锚点缓动

Amaterasu 遮罩转场逐帧播放原站公开的 90 张 WebP 帧图。滚动驱动案例使用可逆的 0–1 进度。Filmbot 和 Spire 在页面元素上计算遮罩；Inkfish 使用真实横向轨道，Hung Design Studio 使用独立图层视差；Scale & Form 用原站 `knight.glb` 实时渲染镜头环绕；Noomo Labs 用原站 `Scene14.glb` 的水母骨骼动画驱动模型；Lawted 加载原站 Spline 场景并根据滚动章节触发场景事件。Kaito Note 使用公开动效记录作为可滚动时间轴，保留原画面，但尚未包含原站视频与独立交互。参考素材需要网络连接。

Vision 首屏的静态人物图来自 Amaterasu 原站主视觉，已移除图内题字以避免与页面标题重叠。

## 验证

```bash
npm test
npm run typecheck
npm run build
```
