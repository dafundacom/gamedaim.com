/** @type {import('next').NextConfig} */
const { withSentryConfig } = require("@sentry/nextjs")

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  images: {
    domains: [
      "assets.gamedaim.com",
      "gamedaim.com",
      "gamedaim.sg-sin1.upcloudobjects.com",
      "caragame.id",
      "secure.gravatar.com",
      "i.postimg.cc",
    ],
  },
  transpilePackages: ["editor", "ui"],
  sentry: {
    silent: true,
    hideSourceMaps: true,
  },
}

module.exports = withSentryConfig(nextConfig)
