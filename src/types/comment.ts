import { Prisma } from '@prisma/client'

export type CommentType = Prisma.CommentsGetPayload<{
  select: {
    id: true
    postId: true
    commentContent: true
    parentCommentId: true
    createdBy: true
    updatedBy: true
    createdAt: true
    updatedAt: true
    isDeleted: true
  }
  include: {
    // childComments: true
    createdUser: {
      include: {
        userInfo: true
      }
    }
    _count: {
      select: {
        votes: true
        childComments: true
      }
    }
    votes: {
      select: {
        vote: true
      }
    }
  }
}>

export type ReplyType = Prisma.CommentsGetPayload<{
  include: {
    createdUser: {
      include: {
        userInfo: true
      }
    }
    _count: {
      select: {
        votes: true
      }
    }
    votes: {
      select: {
        vote: true
      }
    }
  }
}>
