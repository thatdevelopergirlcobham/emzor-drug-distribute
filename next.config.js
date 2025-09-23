/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Environment variables - Next.js expects string values
  env: {
    SUPPRESS_GRAMMARLY_WARNINGS: 'true',
  },
}

module.exports = nextConfig
