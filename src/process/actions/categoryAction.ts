'use server'

import categoryRepository, {
  GetCategoryProps,
  CreateCategoryProps,
  UpdateCategoryProps,
  DeleteCategoryProps,
} from '../repositories/categoryRepository'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/utils/auth'
import { ResponseType, ApplicationError, NotFoundError } from '@/utils/errors'
import { CategoryType } from '@/types/category'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { sanitizeContent } from '@/utils/domPurifier'
import { getUserRoles } from './userActions'
import { ROLES } from '@/utils/consts'

/**
 * Get all top level categories
 * @returns ResponseType<CategoryType[]>
 */
export const getAllCategories = async (): Promise<
  ResponseType<CategoryType[]>
> => {
  try {
    const response = await categoryRepository.getAllTopLevelCategories()
    console.log('getAllCategories')
    return {
      data: response,
      success: true,
    }
  } catch (err) {
    const error = err as Error
    if (error instanceof NotFoundError) {
      return {
        success: false,
        message: 'Category not found',
        type: 'error',
      }
    } else {
      console.error('Error getting all categories:', error?.message)
      throw new ApplicationError('Error getting all categories')
    }
  }
}

export const getCategory = async (
  args: GetCategoryProps
): Promise<ResponseType<CategoryType>> => {
  try {
    const response = await categoryRepository.getCategory(args)
    console.log('getCategory')
    return {
      data: response,
      success: true,
    }
  } catch (err) {
    const error = err as Error
    console.error('Error getting category:', error?.message)
    if (error instanceof NotFoundError) {
      return {
        success: false,
        message: 'Category not found',
        type: 'error',
      }
    } else {
      throw new ApplicationError('Error getting category')
    }
  }
}

export type UpdateCategoryResponse = ResponseType<Partial<CategoryType>>

export const createCategory = async (
  args: CreateCategoryProps
): Promise<UpdateCategoryResponse> => {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  try {
    // verify
    const userRoles = await getUserRoles({ userId: session.user.id })
    if (!userRoles.includes(ROLES.ADMIN)) {
      throw new Error('Unauthorized')
    }
    const sanitizedDescription = sanitizeContent(args.categoryDescription)
    const response = await categoryRepository.createCategory(
      { ...args, categoryDescription: sanitizedDescription },
      session
    )
    console.log('createCategory')
    return {
      data: response,
      success: true,
    }
  } catch (err) {
    const error = err as Error
    console.error('Error creating category:', error?.message)

    if (error instanceof PrismaClientKnownRequestError) {
      // Unique constraint violation
      if (error.code === 'P2002') {
        return {
          success: false,
          message: 'Category with this slug already exists',
          type: 'error',
        }
      }
    }
    return {
      success: false,
      message: 'Error creating category',
      type: 'error',
    }
  }
}

export const updateCategory = async (
  args: UpdateCategoryProps
): Promise<UpdateCategoryResponse> => {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error('Unauthorized')
  try {
    // verify
    const userRoles = await getUserRoles({ userId: session.user.id })
    if (!userRoles.includes(ROLES.ADMIN)) {
      throw new Error('Unauthorized')
    }
    const sanitizedDescription = sanitizeContent(args.categoryDescription)
    const response = await categoryRepository.updateCategory(
      {
        ...args,
        categoryDescription: sanitizedDescription,
      },
      session
    )
    console.log('updateCategory')
    return {
      data: response,
      success: true,
    }
  } catch (err) {
    const error = err as Error
    console.error('Error updating category:', error?.message)
    return {
      success: false,
      message: 'Error updating category',
      type: 'error',
    }
  }
}

export const deleteCategory = async (
  args: DeleteCategoryProps
): Promise<ResponseType<null>> => {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error('Unauthorized')
  try {
    // verify
    const userRoles = await getUserRoles({ userId: session.user.id })
    if (!userRoles.includes(ROLES.ADMIN)) {
      throw new Error('Unauthorized')
    }
    await categoryRepository.deleteCategory(args, session)
    console.log('deleteCategory')
    return {
      success: true,
    }
  } catch (err) {
    const error = err as Error
    console.error('Error deleting category:', error?.message)
    return {
      success: false,
      message: 'Error deleting category',
      type: 'error',
    }
  }
}
