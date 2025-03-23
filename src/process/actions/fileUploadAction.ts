'use server'

import { ResponseType } from '@/utils/errors'
import fileUploadRepository from '../repositories/fileUploadRepository'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import { MAX_FILE_SIZE } from '@/utils/consts'

export type FileUploadResponse = ResponseType<{ url: string }>
export const uploadFile = async (file: File): Promise<FileUploadResponse> => {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('Unauthorized')
  }
  try {
    if (!file) {
      return { success: false, message: 'No file provided' }
    }
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        message: 'File size must be less than 1MB',
      }
    }
    const buffer = Buffer.from(await file.arrayBuffer())
    // console.log('buffer', buffer, file)
    const url = await fileUploadRepository.uploadFile({
      file: buffer,
      filename: file.name,
      mimetype: file.type,
    })
    console.log('uploadFile')
    return {
      success: true,
      data: { url },
    }
  } catch (error) {
    console.error('File upload failed:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'File upload failed',
    }
  }
}

export type FileDeleteResponse = ResponseType<boolean>
export const deleteFile = async (
  fileUrl: string
): Promise<FileDeleteResponse> => {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('Unauthorized')
  }
  try {
    await fileUploadRepository.deleteFile({ fileUrl })
    console.log('deleteFile')
    return {
      success: true,
    }
  } catch (error) {
    console.error('File deletion failed:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'File deletion failed',
    }
  }
}

export const getFileUrl = async (filename: string): Promise<string> => {
  return await fileUploadRepository.getFileUrl(filename)
}
