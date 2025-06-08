import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig() || {
  publicRuntimeConfig: {
    s3Path: '',
    siteName: 'A Modern Forum App',
    siteDescription: 'A Modern Forum App',
    sidebarNewPostCount: 5,
    postListPerPage: 5,
    commentListPerPage: 5,
  },
}

export const config = {
  s3Path: publicRuntimeConfig.s3Path,
  siteName: publicRuntimeConfig.siteName,
  siteDescription: publicRuntimeConfig.siteDescription,
  sidebarNewPostCount: publicRuntimeConfig.sidebarNewPostCount,
  postListPerPage: publicRuntimeConfig.postListPerPage,
  commentListPerPage: publicRuntimeConfig.commentListPerPage,
  // Add more as needed
}
