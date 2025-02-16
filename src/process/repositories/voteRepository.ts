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
      // if the vote is the same, delete the vote
      if (existingVote.vote === args.vote) {
        await prisma.votes.delete({
          where: {
            id: existingVote.id,
          },
        })
        return {
          result: 0,
        }
      }
      // if the vote is different, update the vote
      const updatedVote = await prisma.votes.update({
        where: {
          id: existingVote.id,
        },
        data: {
          vote: args.vote,
        },
      })
      return {
        result: updatedVote.vote,
      }
    }

    // create new vote
    const newVote = await prisma.votes.create({
      data: {
        ...args,
        userId: Number(session.user.id),
      },
    })
    return {
      result: newVote.vote,
    }
  },
}
