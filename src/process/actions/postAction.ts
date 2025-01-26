'use server'

import { getServerSession } from 'next-auth'
import postRepository, {
  GetByCategory,
  GetBySlug,
  CreatePost,
} from '../repositories/postRepository'
import { PostType } from '@/types/post'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export const getPostsByCategory = async (
  args: GetByCategory
): Promise<PostType[]> => {
  const response = postRepository.getByCategory(args)
  console.log('getPostsByCategory')
  return response
}

export const getPostBySlug = async (
  args: GetBySlug
): Promise<PostType | null> => {
  const response = postRepository.getBySlug(args)
  console.log('getPostBySlug')
  return response
}

export const createPost = async (args: CreatePost) => {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('Unauthorized')
  }
  const response = postRepository.createPost(args, session)
  console.log('createPost')
  return response
}
