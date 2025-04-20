'use server'

import { ExecuteVote } from '../repositories/voteRepository'
import { voteRepository } from '../repositories/voteRepository'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getUserById } from './userActions'
import postRepository from '../repositories/postRepository'

export const executeVote = async (args: ExecuteVote) => {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  try {
    // verify
    await getUserById({ userId: session.user.id })

    const result = await voteRepository.executeVote(args, session)
    console.log('executeVote')
    return { success: true, voteCount: result.result }
  } catch (err) {
    const error = err as Error
    console.error('Vote failed', error?.message)
    return { success: false }
  }
}
