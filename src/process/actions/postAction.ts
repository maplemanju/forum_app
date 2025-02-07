'use server'

import { getServerSession } from 'next-auth'
import postRepository, {
  GetByCategory,
  GetBySlug,
  CreatePost,
  UpdatePost,
  DeletePostProps,
  GetByKeyword,
} from '../repositories/postRepository'
import { PostType } from '@/types/post'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { ResponseType, ApplicationError, NotFoundError } from '@/utils/errors'

export type UpdatePostResponse = {
  data?: Partial<PostType>
  success?: boolean
}

export const getRecentPosts = async (): Promise<ResponseType<PostType[]>> => {
  try {
    const response = await postRepository.getRecentPosts()
    console.log('getRecentPosts')
    return {
      data: response,
      success: true,
    }
  } catch (error) {
    console.error('Error getting recent posts:', error)
    throw new ApplicationError('Error getting recent posts')
  }
}

export const getRecentlyUpdatedPosts = async (): Promise<
  ResponseType<PostType[]>
> => {
  try {
    const response = await postRepository.getRecentlyUpdatedPosts()
    console.log('getRecentlyUpdatedPosts')
    return {
      data: response,
      success: true,
    }
  } catch (error) {
    console.error('Error getting recently updated posts:', error)
    throw new ApplicationError('Error getting recently updated posts')
  }
}

export const getPostsByCategory = async (
  args: GetByCategory
): Promise<ResponseType<PostType[]>> => {
  try {
    const response = await postRepository.getByCategory(args)
    console.log('getPostsByCategory')
    return {
      data: response,
      success: true,
    }
  } catch (error) {
    console.error('Error getting posts by category:', error)
    throw new ApplicationError('Error getting posts by category')
  }
}

export const getPostsByKeyword = async (
  args: GetByKeyword
): Promise<ResponseType<PostType[]>> => {
  try {
    const response = await postRepository.getPostsByKeyword(args)
    console.log('getPostsByKeyword')
    return {
      data: response,
      success: true,
    }
  } catch (error) {
    console.error('Error getting posts by keyword:', error)
    throw new ApplicationError('Error getting posts by keyword')
  }
}

export const getPostBySlug = async (
  args: GetBySlug
): Promise<ResponseType<PostType>> => {
  try {
    const response = await postRepository.getBySlug(args)
    console.log('getPostBySlug')
    return {
      data: response,
      success: true,
    }
  } catch (error) {
    if (error instanceof NotFoundError) {
      return {
        success: false,
        message: 'Post not found',
        type: 'error',
      }
    } else {
      console.error('Error getting post by slug:', error)
      throw new ApplicationError('Error getting post by slug')
    }
  }
}

export const createPost = async (
  args: CreatePost
): Promise<UpdatePostResponse> => {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('Unauthorized')
  }
  const response = await postRepository.createPost(args, session)
  console.log('createPost')
  return {
    data: response,
    success: true,
  }
}

export const updatePost = async (
  args: UpdatePost
): Promise<UpdatePostResponse> => {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('Unauthorized')
  }
  console.log('updatePost', args)
  try {
    const response = await postRepository.updatePost(args, session)
    console.log('updatePost')
    return {
      data: response,
      success: true,
    }
  } catch (error) {
    console.error('Error updating post', error)
    return {
      success: false,
    }
  }
}

export const deletePost = async (args: DeletePostProps) => {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('Unauthorized')
  }
  const response = postRepository.deletePost(args, session)
  console.log('deletePost')
  return response
}
