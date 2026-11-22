const hoverSelector = '[data-cursor], a, button, summary, .resume-skill-tags li'

// 进入目标时播放
export function bindResumeSound(page: HTMLElement, audio: HTMLAudioElement, activated: () => boolean) {
  const hover = (event: PointerEvent) => {
    if (event.pointerType === "touch" || !activated()) return
    const target = (event.target as Element).closest(hoverSelector)
    const previous = (event.relatedTarget as Element | null)?.closest?.(hoverSelector)
    if (!target || !page.contains(target) || target === previous) return
    audio.currentTime = 0
    void audio.play()
  }
  page.addEventListener("pointerover", hover)
  return () => {
    page.removeEventListener("pointerover", hover)
    audio.pause()
  }
}
