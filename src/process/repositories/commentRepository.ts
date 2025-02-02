import prisma from '@/utils/prisma'
import { Votes } from '@prisma/client'
import { CommentType } from '@/types/comment'
import { Session } from 'next-auth'

export type GetByPostId = {
  postId: number
}
export type GetById = {
  id: number
}
export type CreateComment = {
  postId: number
  commentContent: string
  parentCommentId?: number | null
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

  createComment: async (args: CreateComment, session: Session) => {
    const comment = await prisma.comments.create({
      data: {
        ...args,
        createdBy: Number(session.user.id),
        updatedBy: Number(session.user.id),
      },
      include: {
        createdUser: {
          include: {
            userInfo: true,
          },
        },
      },
    })
    return comment
  },
}

export default commentRepository

const getVoteCounts = (votes: Votes[]) => {
  const upvotes = votes.filter((vote) => vote.vote === 1).length
  const downvotes = votes.filter((vote) => vote.vote === -1).length
  return upvotes - downvotes
}
