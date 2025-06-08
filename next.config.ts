import type { NextConfig } from 'next'

console.log('S3_HOSTNAME at build:', process.env.S3_HOSTNAME)

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
      // Production AWS S3
      {
        protocol: 'https',
        hostname: 'lifehacksjapan-uploads.s3.ap-northeast-1.amazonaws.com',
        pathname: '/**',
      },
      // Local MinIO
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
