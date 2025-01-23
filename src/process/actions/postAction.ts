'use server'

import postRepository, {
  GetByCategory,
  GetById,
} from '../repositories/postRepository'

export const getPostsByCategory = async (args: GetByCategory) => {
  const response = postRepository.getByCategory(args)
  console.log('getPostsByCategory', response)
  return response
}

export const getPostsById = async (args: GetById) => {
  const response = postRepository.getById(args)
  console.log('getPostsById', response)
  return response
}
