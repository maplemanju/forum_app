import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  env: {
    DATABASE_URL: process.env.DATABASE_URL ?? '',
    S3_ENDPOINT: process.env.S3_ENDPOINT ?? '',
    S3_PORT: process.env.S3_PORT ?? '',
    S3_USE_SSL: process.env.S3_USE_SSL ?? '',
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME ?? '',
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '4MB',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: process.env.S3_USE_SSL === 'true' ? 'https' : 'http',
        hostname: process.env.S3_ENDPOINT ?? '',
        port: process.env.S3_PORT,
        pathname: `/${process.env.S3_BUCKET_NAME}/**`,
      },
    ],
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
      }
    }
    return config
  },
}

export default nextConfig
