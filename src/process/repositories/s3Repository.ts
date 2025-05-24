import { Client } from 'minio'

// MinIO client configuration
const minioClient = new Client({
  endPoint: process.env.S3_ENDPOINT || 'localhost',
  port: parseInt(process.env.S3_PORT || '9000'),
  useSSL: process.env.S3_USE_SSL === 'true',
  accessKey: process.env.S3_ACCESS_KEY,
  secretKey: process.env.S3_SECRET_KEY,
})

const bucketName = process.env.S3_BUCKET_NAME || 'uploads'

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
      return `/${bucketName}/${subDir}/${uniqueFilename}`
    } catch (error) {
      console.error('S3 upload failed:', error)
      throw new Error('Failed to upload file to S3')
    }
  },

  deleteFile: async ({ fileUrl }: DeleteFileProps): Promise<boolean> => {
    try {
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

  // Initialize bucket if it doesn't exist
  initBucket: async () => {
    try {
      const bucketExists = await minioClient.bucketExists(bucketName)
      if (!bucketExists) {
        await minioClient.makeBucket(bucketName)
      }

      const publicPolicy = JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject', 's3:GetBucketLocation'],
            Resource: [
              `arn:aws:s3:::${bucketName}/*`,
              `arn:aws:s3:::${bucketName}`,
            ],
          },
        ],
      })

      await minioClient.setBucketPolicy(bucketName, publicPolicy)
    } catch (error) {
      console.error('Failed to initialize bucket:', error)
      throw new Error('Failed to initialize S3 bucket')
    }
  },
}

export default s3Repository
