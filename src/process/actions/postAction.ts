'use server'

import postRepository, {
  GetByCategory,
  GetById,
} from '../repositories/postRepository'
import { PostType } from '@/types/post'

export const getPostsByCategory = async (
  args: GetByCategory
): Promise<PostType[]> => {
  const response = postRepository.getByCategory(args)
  console.log('getPostsByCategory', response)
  return response
}

export const getPostsById = async (args: GetById): Promise<PostType | null> => {
  const response = postRepository.getById(args)
  console.log('getPostsById', response)
  return response
}
