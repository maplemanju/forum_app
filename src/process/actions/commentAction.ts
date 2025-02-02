'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import commentRepository, {
  GetByPostId,
  GetById,
  CreateComment,
} from '../repositories/commentRepository'
import { CommentType } from '@/types/comment'
import { Comments } from '@prisma/client'

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
