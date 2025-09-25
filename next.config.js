/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable SWC to avoid Windows compatibility issues
  swcMinify: false,
  // Environment variables - Next.js expects string values
  env: {
    SUPPRESS_GRAMMARLY_WARNINGS: 'true',
  },
}

module.exports = nextConfig
