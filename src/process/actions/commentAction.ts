'use server'

import commentRepository, {
  GetByPostId,
  GetById,
} from '../repositories/commentRepository'
import { CommentType } from '@/types/comment'

export const getCommentsByPostId = async (
  args: GetByPostId
): Promise<CommentType[]> => {
  const response = commentRepository.getByPostId(args)
  console.log('getCommentsByPostId')
  return response
}
