import { Client } from 'minio'

export const minioClient = new Client({
  endPoint: process.env.S3_ENDPOINT || 'localhost',
  port: process.env.S3_PORT ? parseInt(process.env.S3_PORT) : undefined,
  useSSL: process.env.S3_USE_SSL === 'true',
  accessKey: process.env.S3_ACCESS_KEY,
  secretKey: process.env.S3_SECRET_KEY,
  region: process.env.S3_REGION,
})

export const bucketName = process.env.S3_BUCKET_NAME || 'uploads'

let bucketInitialized = false
export async function initBucket() {
  if (bucketInitialized) {
    return
  }
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
    bucketInitialized = true
  } catch (error) {
    console.error('Failed to initialize bucket:', error)
    throw new Error('Failed to initialize S3 bucket')
  }
}
