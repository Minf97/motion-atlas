import { Bricolage_Grotesque, DM_Sans, IBM_Plex_Mono, Instrument_Serif, Geist, Montserrat, Playfair_Display } from "next/font/google"

import "./globals.css"
import "./catalogue.css"
import "./loading-studies.css"
import "./scroll-studies.css"
import "./driven-studies.css"
import "./smooth-studies.css"
import "./portfolio.css"
import { cn } from "@/lib/utils";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-portfolio-body" })
const playfair = Playfair_Display({ subsets: ["latin"], weight: "400", variable: "--font-portfolio-heading" })

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display" })
const body = DM_Sans({ subsets: ["latin"], variable: "--font-body" })
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: "400", variable: "--font-mono" })
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: "italic", variable: "--font-serif" })

export const metadata = {
  title: "Minf｜Agent Engineer",
  description: "Portfolio of Minf (胥昱全) - Agent Engineer, Motion Designer, and Frontend Developer.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" className={cn(montserrat.variable, playfair.variable, display.variable, body.variable, mono.variable, serif.variable, "font-sans", geist.variable)}>
      <body>{children}</body>
    </html>
  )
}
