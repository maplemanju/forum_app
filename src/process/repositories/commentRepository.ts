import prisma from '@/utils/prisma'
import { Votes } from '@prisma/client'
import { CommentType } from '@/types/comment'

export type GetByPostId = {
  postId: number
}
export type GetById = {
  id: number
}
export const commentRepository = {
  getByPostId: async (args: GetByPostId) => {
    const comments = await prisma.comments.findMany({
      where: {
        postId: args.postId,
        parentCommentId: null,
      },
      include: {
        childComments: {
          include: {
            votes: true,
            childComments: true,
            createdUser: {
              include: {
                userInfo: true,
              },
            },
          },
        },
        votes: true,
        createdUser: {
          include: {
            userInfo: true,
          },
        },
      },
    })
    const mapCommentWithVotes = (comment: any) => ({
      ...comment,
      _count: {
        votes: getVoteCounts(comment.votes),
      },
      childComments: comment.childComments.map(mapCommentWithVotes),
    })

    const commentsWithVotes = comments.map(mapCommentWithVotes)

    return commentsWithVotes
  },

  getById: async (args: GetById) => {
    const comment = await prisma.comments.findUnique({
      where: {
        id: args.id,
      },
      include: {
        votes: true,
        createdUser: {
          include: {
            userInfo: true,
          },
        },
      },
    })
    if (!comment) return null
    const voteCounts = getVoteCounts(comment.votes)
    return { ...comment, _count: { votes: voteCounts } }
  },
}

export default commentRepository

const getVoteCounts = (votes: Votes[]) => {
  const upvotes = votes.filter((vote) => vote.vote === 1).length
  const downvotes = votes.filter((vote) => vote.vote === -1).length
  return upvotes - downvotes
}
