/** @type {import('next').NextConfig} */
const { withSentryConfig } = require("@sentry/nextjs")
// const withPWA = require("next-pwa")
// const runtimeCaching = require("next-pwa/cache")

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
      "dev-assets.gamedaim.com",
      "i.postimg.cc",
    ],
  },
  transpilePackages: ["editor", "ui"],
  // pwa: {
  //   dest: "public",
  //   runtimeCaching,
  //   register: true,
  //   skipWaiting: true,
  // },
  sentry: {
    silent: true,
    hideSourceMaps: true,
  },
}

module.exports = withSentryConfig(nextConfig)
