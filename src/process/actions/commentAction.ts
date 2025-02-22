'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import commentRepository, {
  GetByPostId,
  CreateComment,
  DeleteComment,
  UpdateComment,
} from '../repositories/commentRepository'
import { CommentType } from '@/types/comment'
import { ResponseType, ApplicationError } from '@/utils/errors'

export const getCommentsByPostId = async (
  args: GetByPostId
): Promise<ResponseType<CommentType[]>> => {
  try {
    const response = await commentRepository.getByPostId(args)
    console.log('getCommentsByPostId')
    return {
      data: response,
      success: true,
    }
  } catch (err) {
    const error = err as Error
    console.error('Error getting comments by post id', error?.message)
    throw new ApplicationError('Error getting comments by post id')
  }
}

export type CreateCommentResponse = {
  data?: Partial<CommentType>
  success?: boolean
}
export const createComment = async (
  payload: CreateComment
): Promise<ResponseType<Partial<CommentType>>> => {
  console.log('createComment', payload)
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('Unauthorized')
  }
  try {
    const response = await commentRepository.createComment(payload, session)
    console.log('createComment')
    return {
      data: response,
      success: true,
    }
  } catch (err) {
    const error = err as Error
    console.error('Error creating comment', error?.message)
    return {
      success: false,
      message: 'Error creating comment',
      type: 'error',
    }
  }
}

export const deleteComment = async (
  args: DeleteComment
): Promise<ResponseType<null>> => {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('Unauthorized')
  }
  try {
    await commentRepository.deleteComment(args, session)
    return {
      success: true,
    }
  } catch (err) {
    const error = err as Error
    console.error('Error deleting comment', error?.message)
    return {
      success: false,
      message: 'Error deleting comment',
      type: 'error',
    }
  }
}

export const updateComment = async (
  args: UpdateComment
): Promise<ResponseType<Partial<CommentType>>> => {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('Unauthorized')
  }
  try {
    const response = await commentRepository.updateComment(args, session)
    return {
      data: response,
      success: true,
    }
  } catch (err) {
    const error = err as Error
    console.error('Error updating comment', error?.message)
    return {
      success: false,
      message: 'Error updating comment',
      type: 'error',
    }
  }
}
