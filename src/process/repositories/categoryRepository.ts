import prisma from '@/utils/prisma'

export type GetCategoryProps = {
  id: number
}
export const categoryRepository = {
  getAll: async () => {
    return await prisma.categories.findMany({
      where: {
        parentCategory: null,
      },
    })
  },
  getCategory: async (args: GetCategoryProps) => {
    return await prisma.categories.findUnique({
      where: {
        id: args.id,
      },
      include: {
        childCategories: true,
        parentCategory: true,
      },
    })
  },
}

export default categoryRepository
