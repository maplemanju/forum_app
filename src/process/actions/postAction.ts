'use server'

import postRepository, {
  GetByCategory,
  GetBySlug,
} from '../repositories/postRepository'
import { PostType } from '@/types/post'

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
