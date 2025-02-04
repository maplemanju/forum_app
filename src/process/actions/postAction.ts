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

export type UpdatePostResponse = {
  data?: Partial<PostType>
  success?: boolean
}

export const getRecentPosts = async (): Promise<PostType[]> => {
  const response = postRepository.getRecentPosts()
  console.log('getRecentPosts')
  return response
}

export const getRecentlyUpdatedPosts = async (): Promise<PostType[]> => {
  const response = postRepository.getRecentlyUpdatedPosts()
  console.log('getRecentlyUpdatedPosts')
  return response
}

export const getPostsByCategory = async (
  args: GetByCategory
): Promise<PostType[]> => {
  const response = postRepository.getByCategory(args)
  console.log('getPostsByCategory')
  return response
}

export const getPostsByKeyword = async (
  args: GetByKeyword
): Promise<PostType[]> => {
  const response = postRepository.getPostsByKeyword(args)
  console.log('getPostsByKeyword')
  return response
}

export const getPostBySlug = async (
  args: GetBySlug
): Promise<PostType | null> => {
  const response = postRepository.getBySlug(args)
  console.log('getPostBySlug')
  return response
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
