'use server'

import categoryRepository, {
  GetCategoryProps,
  CreateCategoryProps,
  UpdateCategoryProps,
  DeleteCategoryProps,
} from '../repositories/categoryRepository'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export const getAllCategories = async () => {
  const response = categoryRepository.getAll()
  console.log('getAllCategories')
  return response
}

export const getCategory = async (args: GetCategoryProps) => {
  const response = categoryRepository.getCategory(args)
  console.log('getCategory')
  return response
}

export const createCategory = async (args: CreateCategoryProps) => {
  const session = await getServerSession(authOptions)
  if (!session?.user) throw new Error('Unauthorized')

  const response = await categoryRepository.createCategory(args, session)
  console.log('createCategory')
  return response
}

export const updateCategory = async (args: UpdateCategoryProps) => {
  const session = await getServerSession(authOptions)
  if (!session?.user) throw new Error('Unauthorized')

  const response = await categoryRepository.updateCategory(args, session)
  console.log('updateCategory')
  return response
}

export const deleteCategory = async (args: DeleteCategoryProps) => {
  const session = await getServerSession(authOptions)
  if (!session?.user) throw new Error('Unauthorized')

  const response = await categoryRepository.deleteCategory(args, session)
  console.log('deleteCategory')
  return response
}
