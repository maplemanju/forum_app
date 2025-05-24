import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  env: {
    DATABASE_URL: process.env.DATABASE_URL ?? '',
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
        hostname: process.env.S3_ENDPOINT || 'localhost',
        port: process.env.S3_PORT || '9000',
        pathname: '/uploads/**',
      },
    ],
  },
}

export default nextConfig
