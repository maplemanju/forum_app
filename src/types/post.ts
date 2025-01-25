import {
  Posts as PrismaPost,
  Categories,
  Users,
  UserInfo,
} from '@prisma/client'

export type PostType = PrismaPost & {
  category: Categories
  createdUser: Users & { userInfo?: UserInfo | null }
  _count: {
    comments: number
    votes: number
  }
}
