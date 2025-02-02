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

export const getCommentsByPostId = async (
  args: GetByPostId
): Promise<CommentType[]> => {
  const response = commentRepository.getByPostId(args)
  console.log('getCommentsByPostId')
  return response
}

export type CreateCommentResponse = {
  data?: Partial<CommentType>
  success?: boolean
}
export const createComment = async (
  payload: CreateComment
): Promise<CreateCommentResponse> => {
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
  } catch (error) {
    console.error('Error creating comment', error)
    return {
      success: false,
    }
  }
}

export const deleteComment = async (args: DeleteComment) => {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('Unauthorized')
  }
  try {
    await commentRepository.deleteComment(args, session)
    return {
      success: true,
    }
  } catch (error) {
    console.error('Error deleting comment', error)
    return {
      success: false,
    }
  }
}

export const updateComment = async (args: UpdateComment) => {
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
  } catch (error) {
    console.error('Error updating comment', error)
    return {
      success: false,
    }
  }
}
