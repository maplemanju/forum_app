import { Comments as PrismaComment, UserInfo, Users } from '@prisma/client'

export type CommentType = PrismaComment & {
  _count: {
    votes: number
  }
  createdUser: Users & {
    userInfo?: UserInfo | null
  }
  childComments: CommentType[]
}
