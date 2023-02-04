/** @type {import('next').NextConfig} */
const { withSentryConfig } = require("@sentry/nextjs")

const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  poweredByHeader: false,
  images: {
    domains: ["gamedaim.com", "secure.gravatar.com", "i.postimg.cc"],
  },
  transpilePackages: ["editor", "ui"],
  sentry: {
    silent: true,
    hideSourceMaps: true,
  },
}

module.exports = withSentryConfig(nextConfig)
