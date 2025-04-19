'use server'

import userRepository, {
  GetBySnsIdProps,
  CreateUserProps,
  GetByIdProps,
} from '../repositories/userRepository'
import { ApplicationError } from '@/utils/errors'

export const getUserBySnsId = async (args: GetBySnsIdProps) => {
  try {
    const userInfo = userRepository.getBySnsId(args)
    console.log('getUserBySnsId')
    return userInfo
  } catch (err) {
    const error = err as Error
    console.error('Error getting user by sns id', error?.message)
    throw new ApplicationError('Error getting user by sns id')
  }
}

export const getUserById = async (args: GetByIdProps) => {
  try {
    const userInfo = userRepository.getById(args)
    console.log('getUserById')
    return userInfo
  } catch (err) {
    const error = err as Error
    console.error('Error getting user by id', error?.message)
    throw new ApplicationError('Error getting user by id')
  }
}

export const createUser = async (args: CreateUserProps) => {
  try {
    const userInfo = userRepository.createUser(args)
    console.log('createUser')
    return userInfo
  } catch (err) {
    const error = err as Error
    console.error('Error creating user', error?.message)
    throw new ApplicationError('Error creating user')
  }
}
