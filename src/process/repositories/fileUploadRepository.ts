import { writeFile, unlink } from 'fs/promises'
import path from 'path'

const uploadDir = path.join(process.cwd(), 'public/uploads')

export type UploadFileProps = {
  file: Buffer
  filename: string
  mimetype: string
}

export type DeleteFileProps = {
  fileUrl: string
}

export const fileUploadRepository = {
  uploadFile: async ({
    file,
    filename,
    mimetype,
  }: UploadFileProps): Promise<string> => {
    try {
      // Validate file type
      if (!mimetype.startsWith('image/')) {
        throw new Error('Invalid file type. Only images are allowed.')
      }

      // Create unique filename
      const uniqueFilename = `${Date.now()}_${filename.replace(
        /[^a-zA-Z0-9.-]/g,
        '_'
      )}`
      const filePath = path.join(uploadDir, uniqueFilename)

      // Save file
      await writeFile(filePath, file)

      // Return public URL
      return `/uploads/${uniqueFilename}`
    } catch (error) {
      console.error('Upload failed:', error)
      throw new Error('Failed to upload file')
    }
  },

  deleteFile: async ({ fileUrl }: DeleteFileProps): Promise<boolean> => {
    try {
      // Extract filename from URL
      const filename = fileUrl.split('/').pop()
      if (!filename) throw new Error('Invalid file URL')

      const filePath = path.join(uploadDir, filename)

      // Delete file
      await unlink(filePath)
      return true
    } catch (error) {
      console.error('Delete failed:', error)
      return false
    }
  },

  getFileUrl: async (filename: string): Promise<string> => {
    // In a real S3 implementation, this would generate a signed URL
    return `/uploads/${filename}`
  },
}

export default fileUploadRepository
