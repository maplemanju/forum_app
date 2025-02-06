'use server'

import categoryRepository, {
  GetCategoryProps,
  CreateCategoryProps,
  UpdateCategoryProps,
  DeleteCategoryProps,
} from '../repositories/categoryRepository'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { ErrorResponse, ApplicationError, NotFoundError } from '@/utils/errors'
import { CategoryType } from '@/types/category'

export const getAllCategories = async (): Promise<
  ErrorResponse<CategoryType[]>
> => {
  try {
    const response = await categoryRepository.getAll()
    console.log('getAllCategories', response)
    return {
      data: response,
      success: true,
    }
  } catch (error) {
    if (error instanceof NotFoundError) {
      return {
        success: false,
        message: 'Category not found',
        type: 'error',
      }
    } else {
      console.error('Error getting all categories:', error)
      throw new ApplicationError('Error getting all categories')
    }
  }
}

export const getCategory = async (
  args: GetCategoryProps
): Promise<ErrorResponse<CategoryType>> => {
  console.log('getCategory', args)
  try {
    const response = await categoryRepository.getCategory(args)
    console.log('getCategory', response)
    return {
      data: response,
      success: true,
    }
  } catch (error) {
    if (error instanceof NotFoundError) {
      console.log('getCategory', error)
      return {
        success: false,
        message: 'Category not found',
        type: 'error',
      }
    } else {
      console.error('Error getting category:', error)
      throw new ApplicationError('Error getting category')
    }
  }
}

export const createCategory = async (
  args: CreateCategoryProps
): Promise<CategoryType | null> => {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) throw new Error('Unauthorized')

    const response = await categoryRepository.createCategory(args, session)
    console.log('createCategory')
    return response
  } catch (error) {
    console.error('Error creating category:', error)
    throw error
  }
}

export const updateCategory = async (
  args: UpdateCategoryProps
): Promise<CategoryType> => {
  const session = await getServerSession(authOptions)
  if (!session?.user) throw new Error('Unauthorized')

  const response = await categoryRepository.updateCategory(args, session)
  console.log('updateCategory')
  return response
}

export const deleteCategory = async (
  args: DeleteCategoryProps
): Promise<CategoryType> => {
  const session = await getServerSession(authOptions)
  if (!session?.user) throw new Error('Unauthorized')

  const response = await categoryRepository.deleteCategory(args, session)
  console.log('deleteCategory')
  return response
}
