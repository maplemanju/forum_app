import { Prisma } from '@prisma/client'

export type PostType = Prisma.PostsGetPayload<{
  include: {
    category: true
    postUpdate: true
    createdUser: {
      include: {
        userInfo: true
      }
    }
    _count: {
      select: {
        comments: true
        votes: true
      }
    }
  }
}>
