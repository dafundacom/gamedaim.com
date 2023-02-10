/** @type {import('next').NextConfig} */
const { withSentryConfig } = require("@sentry/nextjs")
const path = require("path")

const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      "assets.gamedaim.com",
      "gamedaim.com",
      "secure.gravatar.com",
      "i.postimg.cc",
    ],
  },
  transpilePackages: ["editor", "ui"],
  sentry: {
    silent: true,
    hideSourceMaps: true,
  },
  output: "standalone",
  experimental: {
    outputFileTracingRoot: path.join(__dirname, "../../"),
  },
}

module.exports = withSentryConfig(nextConfig)
