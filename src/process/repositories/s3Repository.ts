import { minioClient, bucketName, initBucket } from '@/utils/setupBucket'

export type UploadFileProps = {
  file: Buffer
  filename: string
  mimetype: string
  subDir: string
}

export type DeleteFileProps = {
  fileUrl: string
}

export const s3Repository = {
  uploadFile: async ({
    file,
    filename,
    mimetype,
    subDir,
  }: UploadFileProps): Promise<string> => {
    try {
      // Initialize bucket if needed
      await initBucket()

      // Create unique filename to prevent collisions
      const uniqueFilename = `${Date.now()}_${filename.replace(
        /[^a-zA-Z0-9.-]/g,
        '_'
      )}`

      // Upload to MinIO
      await minioClient.putObject(
        bucketName,
        `${subDir}/${uniqueFilename}`,
        file,
        file.length,
        { 'Content-Type': mimetype }
      )

      // Return the public URL
      return `/${subDir}/${uniqueFilename}`
    } catch (error) {
      console.error('S3 upload failed:', error)
      throw new Error('Failed to upload file to S3')
    }
  },

  deleteFile: async ({ fileUrl }: DeleteFileProps): Promise<boolean> => {
    try {
      // Initialize bucket if needed
      await initBucket()

      // Extract filename from URL
      const filename = fileUrl.split('/').pop()
      if (!filename) {
        throw new Error('Invalid file URL')
      }

      // Delete object from MinIO
      await minioClient.removeObject(bucketName, filename)
      return true
    } catch (error) {
      console.error('S3 delete failed:', error)
      return false
    }
  },
}

export default s3Repository
