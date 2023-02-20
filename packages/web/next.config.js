/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")
const runtimeCaching = require("next-pwa/cache")
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
  sentry: {
    silent: true,
    hideSourceMaps: true,
  },
  pwa: {
    dest: "public",
    runtimeCaching,
    register: true,
    skipWaiting: true,
  },

  transpilePackages: ["editor", "ui"],
}

module.exports = withSentryConfig(withPWA(nextConfig), { silent: true })
