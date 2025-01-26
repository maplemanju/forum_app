'use server'

import categoryRepository, {
  GetCategoryProps,
  CreateCategoryProps,
} from '../repositories/categoryRepository'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { cookies, headers } from 'next/headers'
import { NextRequest } from 'next/server'

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
  return response
}
