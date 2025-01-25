import { Comments as PrismaComment } from '@prisma/client'

export type CommentType = PrismaComment & {
  _count: {
    votes: number
  }
}
