import type { NextConfig } from "next"

const isGithubPages = process.env.GITHUB_ACTIONS === "true"
const basePath = isGithubPages ? "/motion-atlas" : ""

const nextConfig: NextConfig = {
  output: "export",
  devIndicators: false,
  trailingSlash: true,
  images: { unoptimized: true },
  ...(isGithubPages ? { basePath, assetPrefix: `${basePath}/` } : {}),
  env: { NEXT_PUBLIC_BASE_PATH: basePath, NEXT_PUBLIC_AGENT_API_URL: process.env.NEXT_PUBLIC_AGENT_API_URL ?? "" },
}

export default nextConfig
