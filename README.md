# Motion Atlas

一个使用 Next.js 16、React 19、shadcn/ui 与 Lenis 制作的交互特效作品集。首页按 **Loading / Scrolling / Smooth Scrolling** 建立三级目录，点击条目进入独立演示，也可从目录直接查看原站。

## 本地运行

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`。首次进入会播放 Splash；每个演示页均可单独访问，例如 `/effects/image-reveal`。

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
