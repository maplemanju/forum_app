import {
  Posts as PrismaPost,
  Comments,
  Votes,
  Categories,
  Users,
  UserInfo,
} from '@prisma/client'

export type PostType = PrismaPost & {
  comments: Comments[]
  votes: Votes[]
  category: Categories
  createdUser: Users & { userInfo?: UserInfo | null }
}
