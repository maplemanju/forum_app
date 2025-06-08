export const config = {
  s3Path: process.env.NEXT_PUBLIC_S3_PATH ?? '',
  siteName: process.env.NEXT_PUBLIC_SITE_NAME ?? 'A Modern Forum App',
  siteDescription:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ?? 'A Modern Forum App',
  sidebarNewPostCount:
    Number(process.env.NEXT_PUBLIC_SIDEBAR_NEW_POST_COUNT) || 5,
  postListPerPage: Number(process.env.NEXT_PUBLIC_POST_LIST_PER_PAGE) || 5,
  commentListPerPage:
    Number(process.env.NEXT_PUBLIC_COMMENT_LIST_PER_PAGE) || 5,
} as const
