'use server'

import { User } from '@/types/user'
import userRepository, {
  GetBySnsIdProps,
  CreateUserProps,
  GetByIdProps,
  GetUserRolesProps,
  UpdateUserProfileProps,
} from '../repositories/userRepository'
import { ApplicationError, ResponseType } from '@/utils/errors'

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

export type GetUserByIdResponse = ResponseType<User>
export const getUserById = async (
  args: GetByIdProps
): Promise<GetUserByIdResponse> => {
  try {
    const userInfo = await userRepository.getById(args)
    console.log('getUserById')
    return {
      data: userInfo,
      success: true,
    }
  } catch (err) {
    const error = err as Error
    console.error('Error getting user by id', error?.message)
    return {
      success: false,
      message: 'Error getting user by id',
      type: 'error',
    }
  }
}

export const getUserRoles = async (args: GetUserRolesProps) => {
  try {
    const userRoles = userRepository.getUserRoles(args)
    console.log('getUserRoles')
    return userRoles
  } catch (err) {
    const error = err as Error
    console.error('Error getting user roles', error?.message)
    throw new ApplicationError('Error getting user roles')
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

export type UpdateUserProfileResponse = ResponseType<
  Partial<UpdateUserProfileProps>
>
export const updateUserProfile = async (
  args: UpdateUserProfileProps
): Promise<UpdateUserProfileResponse> => {
  try {
    const response = await userRepository.updateUserProfile(args)
    console.log('updateUserProfile')
    return {
      data: {
        userId: args.userId,
        displayName: response.displayName,
        profileImage: response.profileImage || '',
      },
      success: true,
    }
  } catch (err) {
    const error = err as Error
    console.error('Error updating user profile', error?.message)
    return {
      success: false,
      message: 'Error updating user profile',
      type: 'error',
    }
  }
}
