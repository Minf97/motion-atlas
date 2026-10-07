"use client"

import { useEffect, useRef, useState } from "react"
import { horizontalOffset, studyMedia } from "@/lib/study-media"
import { videoTime } from "@/lib/progress"
import { ScaleStudy } from "@/components/scale-study"
import { NoomoStudy } from "@/components/noomo-study"
import { LawtedStudy } from "@/components/lawted-study"

const recordings: Record<string, { name: string; src: string; poster?: string }> = {
  "video-scrub": { name: "KAITO NOTE", src: studyMedia.kaito, poster: "https://assets.awwwards.com/awards/element/2025/04/67ff66f98886c388284553_static.jpeg" },
}

// 推动横向叙事
function InkfishStudy({ progress }: { progress: number }) {
  return <div className="inkfish-study">
    <div className="inkfish-track" style={{ transform: `translate3d(${horizontalOffset(progress, 3)}%, 0, 0)` }}>
      <section className="inkfish-panel inkfish-panel-hero"><video src={studyMedia.inkfishFilm} poster={studyMedia.inkfishPoster} autoPlay muted loop playsInline /><div className="inkfish-hero-copy"><strong>SUSPICIOUSLY LOW-PRICED<br />GROCERIES</strong><span>LIDL　 [2022]</span></div></section>
      <section className="inkfish-panel inkfish-panel-copy"><strong>LIDL WERE NEW TO THE AMERICAN GROCERY MARKET. THEY WANTED THE COUNTRY TO KNOW THAT THEY HAD THE BEST QUALITY FOOD AT THE LOWEST PRICES.</strong><p>Which sounds improbable…unless you turn it into a conspiracy theory, in which case everyone will believe it.</p><span>[S.01]　 RETAIL</span></section>
      <section className="inkfish-panel inkfish-panel-film"><video src={studyMedia.inkfishDetailFilm} autoPlay muted loop playsInline /><span>CREATIVE DIRECTION<br />CONCEPT CREATION<br />COPYWRITING<br />ART DIRECTION</span></section>
    </div>
    <nav className="inkfish-nav"><strong>inkfish.</strong><span>HOME<br />WORK [17]</span><span>ABOUT<br />CONTACT</span><span>SUSPICIOUSLY LOW-PRICED GROCERIES<br />LIDL</span><span>[{Math.round(progress * 100)}%]</span></nav>
    <div className="inkfish-ticks" aria-hidden="true">{Array.from({ length: 25 }, (_, index) => <i key={index} />)}</div>
  </div>
}

// 错速位移图层
function HungStudy({ progress }: { progress: number }) {
  return <div className="hung-study">
    <div className="hung-small" style={{ backgroundImage: `url(${studyMedia.hungSmall})`, transform: `translate3d(0, ${-progress * 110}px, 0)` }} />
    <div className="hung-title" style={{ transform: `translate3d(0, ${-progress * 430}px, 0)`, opacity: Math.max(0, 1 - progress * 2.5) }}><small>NATIONAL SAFETY COUNCIL</small><strong>PRESCRIBED<br /><em>TO DEATH</em></strong></div>
    <div className="hung-wall" style={{ backgroundImage: `url(${studyMedia.hungBig})`, transform: `translate3d(0, ${220 - progress * 270}px, 0) scale(${1.14 - progress * .14})` }} />
    <div className="hung-green" style={{ transform: `translate3d(0, ${100 - progress * 115}%, 0)` }}><span>TYPE / NSC 2022</span><strong>EVERY ONE<br />IS A LIFE.</strong><span>PROJECT 03 / 14</span></div>
    <nav className="hung-nav"><strong>hung°</strong><span>LET&apos;S TALK　　☰</span></nav>
  </div>
}

// 滚动定位原片
function RecordingStudy({ slug, progress }: { slug: string; progress: number }) {
  const recording = recordings[slug]
  const videoRef = useRef<HTMLVideoElement>(null)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const video = videoRef.current
    if (video && duration) video.currentTime = videoTime(progress, duration - 0.05)
  }, [progress, duration])

  return <div className={`recording-study recording-${slug}`}>
    <video ref={videoRef} src={recording.src} poster={recording.poster} muted playsInline preload="auto" onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)} aria-label={`${recording.name} 原站动效记录，随滚动控制画面`} />
    <span className="recording-credit">{recording.name} / ORIGINAL MOTION STUDY</span>
  </div>
}

export function DrivenStudy({ slug, progress }: { slug: string; progress: number }) {
  if (slug === "image-reveal") return <div className="filmbot-study">
    <nav><strong>f.</strong><span>EMPOWER YOUR TEAM　 ·　 IMPRESS YOUR AUDIENCE</span><span>MENU +</span></nav>
    <p>This is a time of rebirth for collective film culture.<br /><span>We empower the cinema teams leading this movement.</span></p>
    <div className="filmbot-window" style={{ clipPath: `inset(${(1 - progress) * 33}% ${(1 - progress) * 37}% round ${(1 - progress) * 180}px)` }}>
      <div style={{ backgroundImage: `url(${studyMedia.filmbotCinema})`, transform: `scale(${1.25 - progress * 0.25})` }} />
    </div>
    <span className="filmbot-caption">FILM IS BETTER TOGETHER.</span>
  </div>

  if (slug === "mask-generation") return <div className="spire-study">
    <div className="spire-under"><span>SPIRE / GLOBAL</span><strong>Protect,<br />defend, and<br />serve.</strong><p>Data and insights from space<br />for life on Earth.</p></div>
    <div className="spire-mask" style={{ clipPath: `circle(${progress * 95}% at 50% 50%)`, backgroundImage: `url(${studyMedia.spirePoster})` }} />
    <span className="spire-mark">◭</span><span className="spire-menu">MENU ☰</span>
  </div>

  if (slug === "camera") return <ScaleStudy progress={progress} />
  if (slug === "model") return <NoomoStudy progress={progress} />
  if (slug === "scene") return <LawtedStudy progress={progress} />

  if (slug === "horizontal") return <InkfishStudy progress={progress} />
  if (slug === "vertical") return <HungStudy progress={progress} />

  if (recordings[slug]) return <RecordingStudy slug={slug} progress={progress} />

  throw new Error(`Unknown scroll study: ${slug}`)
}
