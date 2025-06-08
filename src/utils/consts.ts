export enum ROLES {
  ADMIN,
  MODERATOR,
  USER,
}

export const MAX_FILE_SIZE = 4 * 1024 * 1024 // 4MB in bytes
export const S3_PATH = process.env.NEXT_PUBLIC_S3_PATH!
