export type EffectCategory = "loading" | "scrolling" | "smooth"

export type EffectGroup = "Splash" | "Transition" | "Scroll Trigger" | "Scroll Driven" | "Lenis"

export type Effect = {
  slug: string
  title: string
  subtitle: string
  category: EffectCategory
  group: EffectGroup
  number: string
  description: string
  reference: {
    name: string
    url: string
    motionUrl?: string
    cue: string
  }
}

export const effects: Effect[] = [
  { slug: "splash", title: "Splash", subtitle: "首次进入", category: "loading", group: "Splash", number: "01", description: "黑场中的进度条与大号数字计数；加载完成后揭开内容。", reference: { name: "Lusion", url: "https://lusion.co/", cue: "首次进入时的全屏加载" } },
  { slug: "mask-transition", title: "Mask Transition", subtitle: "遮罩式转场", category: "loading", group: "Transition", number: "02", description: "液态遮罩铺满画面，在完整覆盖的一刻切换页面内容。", reference: { name: "Amaterasu", url: "https://amaterasu.ai/", motionUrl: "https://www.awwwards.com/inspiration/mask-reveal-page-transition-amaterasu", cue: "Vision → Aleph 的遮罩切页" } },
  { slug: "overlap-transition", title: "Overlap Transition", subtitle: "交叠式转场", category: "loading", group: "Transition", number: "03", description: "作品页覆盖在列表之上，保留新旧画面的空间关系。", reference: { name: "Jealous Films", url: "https://showcase.studiothis.co.uk/jealous/work/", motionUrl: "https://www.awwwards.com/inspiration/portfolio-infinite-scroll-navigation-page-transition-jealous-films-1", cue: "Work → 作品详情" } },
  { slug: "shared-element", title: "Shared Element", subtitle: "共享元素式转场", category: "loading", group: "Transition", number: "04", description: "列表中的同一张图片移动并放大，成为详情页的主图。", reference: { name: "Ruba", url: "https://ruba.ch/", motionUrl: "https://www.awwwards.com/inspiration/image-transition-ruba", cue: "项目缩略图 → 项目详情" } },
  { slug: "scroll-trigger", title: "Scroll Trigger", subtitle: "滚动触发", category: "scrolling", group: "Scroll Trigger", number: "05", description: "作品进入视口时才开始呈现，滚动决定各段内容何时登场。", reference: { name: "Lusion", url: "https://lusion.co/", cue: "Featured Work 区域" } },
  { slug: "image-reveal", title: "Image Reveal", subtitle: "图片裁剪展开", category: "scrolling", group: "Scroll Driven", number: "06", description: "图片的裁剪边界与尺寸跟随滚动进度展开或收合。", reference: { name: "Filmbot", url: "https://filmbot.com/", motionUrl: "https://www.awwwards.com/inspiration/scrolling-image-reveal-filmbot", cue: "Scrolling image reveal" } },
  { slug: "mask-generation", title: "Mask Generation", subtitle: "遮罩生成", category: "scrolling", group: "Scroll Driven", number: "07", description: "滚动逐步生成遮罩，反向滚动时按同一路径收合。", reference: { name: "Spire", url: "https://spire.com/", motionUrl: "https://www.awwwards.com/inspiration/mask-reveal-effect-spire", cue: "Mask reveal effect" } },
  { slug: "video-scrub", title: "Video Scrub", subtitle: "视频帧控制", category: "scrolling", group: "Scroll Driven", number: "08", description: "页面位置对应视频时间轴，可以前进，也可以逐帧倒退。", reference: { name: "Kaito Note", url: "https://kaitonote.com/", motionUrl: "https://www.awwwards.com/inspiration/scroll-scrub-animation-kaito-note-portfolio", cue: "Scroll scrub animation" } },
  { slug: "horizontal", title: "Horizontal Motion", subtitle: "横向位移", category: "scrolling", group: "Scroll Driven", number: "09", description: "垂直滚动推动横向内容，阅读方向在同一段落中改变。", reference: { name: "Inkfish", url: "https://inkfishnyc.com/work/lidl-suspiciously-low-priced-groceries", motionUrl: "https://www.awwwards.com/inspiration/horizontal-scroll-inkfish", cue: "Lidl 项目页横向段落" } },
  { slug: "camera", title: "Camera Angle", subtitle: "摄像机视角", category: "scrolling", group: "Scroll Driven", number: "10", description: "镜头围绕固定雕塑运动，滚动位置控制观察角度。", reference: { name: "Scale & Form", url: "https://scfo.de/", motionUrl: "https://www.awwwards.com/inspiration/scroll-scrubbed-camera-orbiting-a-single-3d-sculpture-scale-form", cue: "雕塑镜头环绕" } },
  { slug: "model", title: "Model Animation", subtitle: "复杂模型动画", category: "scrolling", group: "Scroll Driven", number: "11", description: "滚动推进模型的变化与组合，观察连续的 3D 运动。", reference: { name: "Noomo Labs", url: "https://labs.noomoagency.com/", motionUrl: "https://www.awwwards.com/inspiration/3d-scroll-animation-noomo-labs", cue: "3D scroll animation" } },
  { slug: "scene", title: "3D Scene Shift", subtitle: "3D 场景转换", category: "scrolling", group: "Scroll Driven", number: "12", description: "滚动推动镜头离开一个空间，进入叙事中的下一场景。", reference: { name: "Lawted", url: "https://www.lawted.tech/", motionUrl: "https://www.awwwards.com/inspiration/smooth-scene-transition-lawted-immersive-3d-story", cue: "滚动叙事中的场景转换" } },
  { slug: "vertical", title: "Vertical Motion", subtitle: "竖向位移", category: "scrolling", group: "Scroll Driven", number: "13", description: "用不同速度的垂直位移建立内容层次。", reference: { name: "Hung Design Studio", url: "https://www.hungdesign.studio/nsc-2022", motionUrl: "https://www.awwwards.com/inspiration/scrolling-parallax-hung-design-studio", cue: "项目页滚动视差" } },
  { slug: "smooth-scroll", title: "Smooth Scrolling", subtitle: "Lenis 缓动滚动", category: "smooth", group: "Lenis", number: "14", description: "对比原生滚动与 Lenis 缓动，并体验锚点位置过渡。", reference: { name: "Lenis", url: "https://lenis.dev/", motionUrl: "https://lenis.darkroom.engineering/showcase", cue: "官方站滚动与锚点体验" } },
]

export const getEffect = (slug: string) => effects.find((effect) => effect.slug === slug)


// 生成相邻导航
export function getEffectNavigation(slug: string, english = false) {
  const index = effects.findIndex(effect => effect.slug === slug)
  if (index === -1) throw new Error(`Unknown effect: ${slug}`)
  const prefix = english ? "/en" : ""
  return {
    home: `${prefix}/#work`,
    previous: effects[(index - 1 + effects.length) % effects.length],
    next: effects[(index + 1) % effects.length],
    prefix,
  }
}
