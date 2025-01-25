import {
  Posts as PrismaPost,
  Comments,
  Votes,
  Categories,
} from '@prisma/client'

export type PostType = PrismaPost & {
  comments: Comments[]
  votes: Votes[]
  category: Categories
}
