import prisma from '@/utils/prisma'

export type GetByCategory = {
  categoryId: number
}
export type GetById = {
  id: number
}
export const postRepository = {
  getByCategory: async (args: GetByCategory) => {
    return await prisma.posts.findMany({
      where: {
        categoryId: args.categoryId,
      },
      include: {
        comments: true,
        category: true,
        votes: true,
      },
    })
  },

  getById: async (args: GetById) => {
    return await prisma.posts.findUnique({
      where: {
        id: args.id,
      },
      include: {
        comments: true,
        category: true,
        votes: true,
      },
    })
  },
}

export default postRepository
