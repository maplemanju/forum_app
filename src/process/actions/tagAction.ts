import { tagRepository } from '../repositories/tagRepository'

export const getTags = async (): Promise<string[]> => {
  const response = await tagRepository.getTags()
  console.log('getTags')
  return response
}
