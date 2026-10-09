import { Bricolage_Grotesque, DM_Sans, IBM_Plex_Mono, Instrument_Serif, Geist } from "next/font/google"

import "./globals.css"
import "./catalogue.css"
import "./loading-studies.css"
import "./scroll-studies.css"
import "./driven-studies.css"
import "./smooth-studies.css"
import "./portfolio.css"
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display" })
const body = DM_Sans({ subsets: ["latin"], variable: "--font-body" })
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: "400", variable: "--font-mono" })
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: "italic", variable: "--font-serif" })

export const metadata = {
  title: "胥昱全 — 前端开发与交互作品集",
  description: "胥昱全的前端作品集，收录 Loading、页面转场、滚动交互与 Lenis 缓动案例。",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" className={cn(display.variable, body.variable, mono.variable, serif.variable, "font-sans", geist.variable)}>
      <body>{children}</body>
    </html>
  )
}
