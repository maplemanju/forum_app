import prisma from '@/utils/prisma'
import { Session } from 'next-auth'

export type ExecuteVote = {
  postId?: number
  commentId?: number
  vote: number
}
export const voteRepository = {
  executeVote: async (args: ExecuteVote, session: Session) => {
    const existingVote = await prisma.votes.findFirst({
      where: {
        userId: Number(session.user.id),
        ...(args.postId ? { postId: args.postId } : {}),
        ...(args.commentId ? { commentId: args.commentId } : {}),
      },
    })

    if (existingVote) {
      if (existingVote.vote === args.vote) {
        throw new Error('User has already voted with the same value')
      }
      await prisma.votes.update({
        where: {
          id: existingVote.id,
        },
        data: {
          vote: args.vote,
        },
      })
      return {
        result: args.vote,
      }
    }
    // create new vote
    await prisma.votes.create({
      data: {
        ...args,
        userId: Number(session.user.id),
      },
    })
    // on create append if upvote only
    return {
      result: args.vote === 1 ? 1 : 0,
    }
  },
}
