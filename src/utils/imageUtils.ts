import { config } from './config'

export const getImagePath = (path: string | null | undefined): string => {
  if (!path) return ''

  // If the path is already a full URL, return it as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  // Otherwise, prepend the S3 path
  return `${config.s3Path}${path}`
}
