'use server'

import userRepository, {
  GetBySnsIdProps,
  CreateUserProps,
} from '../repositories/userRepository'
import { ApplicationError } from '@/utils/errors'

export const getUserBySnsId = async (args: GetBySnsIdProps) => {
  try {
    const userInfo = userRepository.getBySnsId(args)
    console.log('getUserBySnsId')
    return userInfo
  } catch (error) {
    console.error('Error getting user by sns id', error)
    throw new ApplicationError('Error getting user by sns id')
  }
}

export const createUser = async (args: CreateUserProps) => {
  try {
    const userInfo = userRepository.createUser(args)
    console.log('createUser')
    return userInfo
  } catch (error) {
    console.error('Error creating user', error)
    throw new ApplicationError('Error creating user')
  }
}
