import prisma from '@/utils/prisma'
import { Session } from 'next-auth'

export type GetCategoryProps = {
  slug: string
}
export type CreateCategoryProps = {
  categoryName: string
  categoryDescription: string
  slug: string
  parentCategoryId?: number | null
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
  createCategory: async (args: CreateCategoryProps, session: Session) => {
    return await prisma.categories.create({
      data: {
        categoryName: args.categoryName,
        categoryDescription: args.categoryDescription,
        slug: args.slug,
        parentCategoryId: args.parentCategoryId,
        createdBy: Number(session.user.id),
        updatedBy: Number(session.user.id),
      },
    })
  },
}

export default categoryRepository
