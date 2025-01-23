'use server'

import categoryRepository, {
  GetCategoryProps,
} from '../repositories/categoryRepository'

export const getAllCategories = async () => {
  const response = categoryRepository.getAll()
  console.log('getAllCategories', response)
  return response
}

export const getCategory = async (args: GetCategoryProps) => {
  const response = categoryRepository.getCategory(args)
  console.log('getCategory', response)
  return response
}
