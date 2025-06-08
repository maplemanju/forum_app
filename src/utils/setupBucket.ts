import { Client } from 'minio'

// Add debug logging
const logConfig = () => {
  console.log('S3 Configuration:', {
    endPoint: process.env.S3_ENDPOINT,
    port: process.env.S3_PORT ? parseInt(process.env.S3_PORT) : undefined,
    useSSL: process.env.S3_USE_SSL === 'true',
    region: process.env.S3_REGION,
    // Don't log actual credentials
    hasAccessKey: !!process.env.S3_ACCESS_KEY,
    hasSecretKey: !!process.env.S3_SECRET_KEY,
  })
}

export const minioClient = new Client({
  endPoint: process.env.S3_ENDPOINT!,
  port: process.env.S3_PORT ? parseInt(process.env.S3_PORT) : undefined,
  useSSL: process.env.S3_USE_SSL === 'true',
  accessKey: process.env.S3_ACCESS_KEY,
  secretKey: process.env.S3_SECRET_KEY,
  region: process.env.S3_REGION,
})

export const bucketName = process.env.S3_BUCKET_NAME!

let bucketInitialized = false
export async function initBucket() {
  if (bucketInitialized) {
    return
  }
  try {
    // Log configuration before attempting connection
    logConfig()

    const bucketExists = await minioClient.bucketExists(bucketName)
    console.log('Bucket exists check:', { bucketName, exists: bucketExists })

    if (!bucketExists) {
      console.log('Creating bucket:', bucketName)
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

    console.log('Setting bucket policy')
    await minioClient.setBucketPolicy(bucketName, publicPolicy)
    bucketInitialized = true
    console.log('Bucket initialization complete')
  } catch (error) {
    console.error('Failed to initialize bucket:', error)
    // Log more detailed error information
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      })
    }
    throw new Error('Failed to initialize S3 bucket')
  }
}
