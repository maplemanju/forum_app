import { tagRepository } from '../repositories/tagRepository'
import { ResponseType, ApplicationError } from '@/utils/errors'

export const getTags = async (): Promise<ResponseType<string[]>> => {
  try {
    const response = await tagRepository.getTags()
    console.log('getTags')
    return {
      data: response,
      success: true,
    }
  } catch (error) {
    console.error('Error getting tags:', error)
    throw new ApplicationError('Error getting tags')
  }
}
