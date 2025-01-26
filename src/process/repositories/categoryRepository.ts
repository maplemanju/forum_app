import prisma from '@/utils/prisma'

export type GetCategoryProps = {
  slug: string
}
export const categoryRepository = {
  getAll: async () => {
    return await prisma.categories.findMany({
      where: {
        parentCategoryId: null,
      },
    })
  },
  getCategory: async (args: GetCategoryProps) => {
    return await prisma.categories.findUnique({
      where: {
        slug: args.slug,
      },
      include: {
        childCategories: true,
        parentCategory: true,
      },
    })
  },
}

export default categoryRepository
