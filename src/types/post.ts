import { Prisma } from '@prisma/client'

export type PostType = Prisma.PostsGetPayload<{
  include: {
    category: true
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
