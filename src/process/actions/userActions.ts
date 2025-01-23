'use server'

import userRepository, {
  GetBySnsIdProps,
  CreateUserProps,
} from '../repositories/userRepository'

export const getUserBySnsId = async (args: GetBySnsIdProps) => {
  const userInfo = userRepository.getBySnsId(args)
  console.log('getUserBySnsId', userInfo)
  return userInfo
}

export const createUser = async (args: CreateUserProps) => {
  const userInfo = userRepository.createUser(args)
  console.log('createUser', userInfo)
  return userInfo
}
