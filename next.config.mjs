/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  env: {
    SUPPRESS_GRAMMARLY_WARNINGS: 'true',
  },
  images: {
    domains: ['medecify.com'],
  },
};

export default nextConfig;
