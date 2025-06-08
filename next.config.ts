import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  env: {
    DATABASE_URL: process.env.DATABASE_URL ?? '',
    S3_ENDPOINT: process.env.S3_ENDPOINT ?? '',
    S3_PORT: process.env.S3_PORT ?? '',
    S3_USE_SSL: process.env.S3_USE_SSL ?? '',
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME ?? '',
    S3_HOSTNAME: process.env.S3_HOSTNAME ?? '',
    S3_REGION: process.env.S3_REGION ?? '',
    ENV: process.env.ENV ?? '',
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '4MB',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.S3_HOSTNAME ?? 'localhost',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
