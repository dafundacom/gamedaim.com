/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")
const runtimeCaching = require("next-pwa/cache")
const { withSentryConfig } = require("@sentry/nextjs")
const { withPlugins } = require("next-compose-plugins")

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
}

module.exports = withPlugins(
  [
    [
      withPWA,
      {
        pwa: {
          dest: "public",
          runtimeCaching,
          register: true,
          skipWaiting: true,
        },
      },
    ],
    [
      withSentryConfig,
      {
        sentry: {
          silent: true,
          hideSourceMaps: true,
        },
      },
    ],
  ],
  nextConfig,
)
