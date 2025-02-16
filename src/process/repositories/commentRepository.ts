import prisma from '@/utils/prisma'
import { Votes } from '@prisma/client'
import { CommentType } from '@/types/comment'
import { getServerSession, Session } from 'next-auth'
import postRepository from './postRepository'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

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
export type DeleteComment = {
  id: number
}
export type UpdateComment = {
  id: number
  commentContent: string
}
export const commentRepository = {
  getByPostId: async (args: GetByPostId) => {
    const session = await getServerSession(authOptions)
    const comments = await prisma.comments.findMany({
      where: {
        postId: args.postId,
        parentCommentId: null,
        isDeleted: false,
      },
      include: {
        childComments: {
          where: {
            isDeleted: false,
          },
          include: {
            createdUser: {
              include: {
                userInfo: true,
              },
            },
            _count: {
              select: {
                votes: {
                  where: {
                    vote: 1,
                  },
                },
              },
            },
            votes: session
              ? {
                  where: {
                    userId: Number(session.user.id),
                  },
                  select: {
                    vote: true,
                  },
                }
              : undefined,
          },
        },
        createdUser: {
          include: {
            userInfo: true,
          },
        },
        _count: {
          select: {
            votes: {
              where: {
                vote: 1,
              },
            },
          },
        },
        votes: session
          ? {
              where: {
                userId: Number(session.user.id),
              },
              select: {
                vote: true,
              },
            }
          : undefined,
      },
    })
    return comments
  },

  getById: async (args: GetById) => {
    const comment = await prisma.comments.findUnique({
      where: {
        id: args.id,
        isDeleted: false,
      },
      include: {
        createdUser: {
          include: {
            userInfo: true,
          },
        },
        votes: {
          where: {
            vote: 1,
          },
        },
      },
    })
    if (!comment) return null
    return comment
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
    if (!comment.parentCommentId) {
      await postRepository.updatePostUpdate(comment.postId)
    }
    return comment
  },

  deleteComment: async (args: DeleteComment, session: Session) => {
    return await prisma.comments.update({
      where: { id: args.id },
      data: { isDeleted: true, updatedBy: Number(session.user.id) },
    })
  },

  updateComment: async (args: UpdateComment, session: Session) => {
    const comment = await prisma.comments.update({
      where: { id: args.id },
      data: {
        commentContent: args.commentContent,
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

// votes with negative downvotes
const getVoteCounts = (votes: Votes[]) => {
  const upvotes = votes.filter((vote) => vote.vote === 1).length
  const downvotes = votes.filter((vote) => vote.vote === -1).length
  return upvotes - downvotes
}
