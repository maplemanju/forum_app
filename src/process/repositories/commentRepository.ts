import prisma from '@/utils/prisma'
import { getServerSession, Session } from 'next-auth'
import postRepository from './postRepository'
import { authOptions } from '@/utils/auth'
import type { Prisma } from '@prisma/client'

export type GetByPostId = {
  postId: number
}
export type GetByCommentId = {
  commentId: number
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
export type CommentStats = {
  take?: number
  skip?: number
  sort?: 'oldest' | 'newest' | 'popular' | 'rated'
}

export const commentRepository = {
  getByPostId: async (args: GetByPostId & CommentStats) => {
    const session = await getServerSession(authOptions)
    let orderBy: Prisma.CommentsOrderByWithRelationInput[] = []
    if (args.sort === 'popular') {
      orderBy = [{ childComments: { _count: 'desc' } }]
    } else if (args.sort === 'rated') {
      orderBy = [{ votes: { _count: 'desc' } }]
    } else if (args.sort === 'newest') {
      orderBy = [{ createdAt: 'desc' }]
    } else {
      orderBy = [{ createdAt: 'asc' }]
    }
    const comments = await prisma.comments.findMany({
      where: {
        postId: args.postId,
        parentCommentId: null,
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
            childComments: {
              where: {
                isDeleted: false,
              },
            },
          },
        },
        votes: session
          ? {
              where: {
                userId: session.user.id,
              },
              select: {
                vote: true,
              },
            }
          : undefined,
      },
      orderBy: [...orderBy, { createdAt: 'asc' }],
      take: args.take,
      skip: args.skip,
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
        createdBy: session.user.id!,
        updatedBy: session.user.id!,
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
      data: { isDeleted: true, updatedBy: session.user.id },
    })
  },

  updateComment: async (args: UpdateComment, session: Session) => {
    const comment = await prisma.comments.update({
      where: { id: args.id },
      data: {
        commentContent: args.commentContent,
        updatedBy: session.user.id,
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

  getRepliesByCommentId: async (args: GetByCommentId & CommentStats) => {
    const session = await getServerSession(authOptions)
    let orderBy: Prisma.CommentsOrderByWithRelationInput[] = []
    if (args.sort === 'rated') {
      orderBy = [{ votes: { _count: 'desc' } }]
    } else if (args.sort === 'newest') {
      orderBy = [{ createdAt: 'desc' }]
    } else {
      orderBy = [{ createdAt: 'asc' }]
    }
    const comments = await prisma.comments.findMany({
      where: {
        parentCommentId: args.commentId,
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
                userId: session.user.id,
              },
              select: {
                vote: true,
              },
            }
          : undefined,
      },
      orderBy: [...orderBy, { createdAt: 'asc' }],
      take: args.take,
      skip: args.skip,
    })
    return comments
  },
}

export default commentRepository
