export const getImagePath = (filename: string) => {
  return `${process.env.NEXT_PUBLIC_S3_PATH}${filename}`
}
