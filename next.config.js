/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // This helps suppress hydration warnings from browser extensions
    suppressHydrationWarning: true,
  },
  // Environment variables
  env: {
    // Set to false in production if hydration warnings become an issue
    SUPPRESS_GRAMMARLY_WARNINGS: process.env.NODE_ENV === 'development',
  },
}

module.exports = nextConfig
