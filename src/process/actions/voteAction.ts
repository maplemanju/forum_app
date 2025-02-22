'use server'

import { ExecuteVote } from '../repositories/voteRepository'
import { voteRepository } from '../repositories/voteRepository'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export const executeVote = async (args: ExecuteVote) => {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('Unauthorized')
  }
  try {
    const result = await voteRepository.executeVote(args, session)
    return { success: true, voteCount: result.result }
  } catch (err) {
    const error = err as Error
    console.error('Vote failed', error?.message)
    return { success: false }
  }
}
