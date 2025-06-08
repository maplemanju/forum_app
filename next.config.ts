import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  publicRuntimeConfig: {
    s3Path: process.env.NEXT_PUBLIC_S3_PATH,
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    siteName: process.env.NEXT_PUBLIC_SITE_NAME,
    siteDescription: process.env.NEXT_PUBLIC_SITE_DESCRIPTION,
    sidebarNewPostCount: process.env.NEXT_PUBLIC_SIDEBAR_NEW_POST_COUNT,
    postListPerPage: process.env.NEXT_PUBLIC_POST_LIST_PER_PAGE,
    commentListPerPage: process.env.NEXT_PUBLIC_COMMENT_LIST_PER_PAGE,
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
        hostname: process.env.S3_HOSTNAME!,
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
