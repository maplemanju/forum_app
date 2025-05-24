'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/utils/auth'
import commentRepository, {
  GetByPostId,
  CreateComment,
  DeleteComment,
  UpdateComment,
  CommentStats,
  GetByCommentId,
} from '../repositories/commentRepository'
import { CommentType, ReplyType } from '@/types/comment'
import { ResponseType, ApplicationError } from '@/utils/errors'
import { sanitizeContent } from '@/utils/domPurifier'
import { ROLES } from '@/utils/consts'
import { getUserById } from './userActions'

export const getCommentsByPostId = async (
  args: GetByPostId & CommentStats
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

export const getRepliesByCommentId = async (
  args: GetByCommentId & CommentStats
): Promise<ResponseType<ReplyType[]>> => {
  try {
    const response = await commentRepository.getRepliesByCommentId(args)
    console.log('getRepliesByCommentId')
    return {
      data: response,
      success: true,
    }
  } catch (err) {
    const error = err as Error
    console.error('Error getting replies by comment id', error?.message)
    throw new ApplicationError('Error getting replies by comment id')
  }
}

export type CreateCommentResponse = {
  data?: Partial<CommentType>
  success?: boolean
}
export const createComment = async (
  payload: CreateComment
): Promise<ResponseType<Partial<CommentType>>> => {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  try {
    // verify
    await getUserById({ userId: session.user.id })
    const sanitizedContent = sanitizeContent(payload.commentContent)
    const response = await commentRepository.createComment(
      { ...payload, commentContent: sanitizedContent },
      session
    )
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
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  try {
    // verify
    const existingComment = await commentRepository.getById({ id: args.id })
    if (!existingComment) {
      throw new Error('Comment not found')
    }
    const user = await getUserById({ userId: session.user.id })
    const isOwner = user.data?.publicId === existingComment.createdBy
    const isAdmin = user.data?.userRoles.some(
      (role) => role.roleId === ROLES.ADMIN
    )
    if (!isOwner && !isAdmin) {
      throw new Error('Unauthorized')
    }
    await commentRepository.deleteComment(args, session)
    console.log('deleteComment')
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
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  try {
    // verify
    const existingComment = await commentRepository.getById({ id: args.id })
    if (!existingComment) {
      throw new Error('Comment not found')
    }
    const user = await getUserById({ userId: session.user.id })
    const isOwner = user.data?.publicId === existingComment.createdBy
    const isAdmin = user.data?.userRoles.some(
      (role) => role.roleId === ROLES.ADMIN
    )
    if (!isOwner && !isAdmin) {
      throw new Error('Unauthorized')
    }

    const sanitizedContent = sanitizeContent(args.commentContent)
    const response = await commentRepository.updateComment(
      { ...args, commentContent: sanitizedContent },
      session
    )
    console.log('updateComment')
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
