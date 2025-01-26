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
export type UpdateCategoryProps = {
  id: number
  categoryName: string
  categoryDescription: string
  slug: string
}
export type DeleteCategoryProps = {
  id: number
}
export const categoryRepository = {
  getAll: async () => {
    return await prisma.categories.findMany({
      where: {
        parentCategoryId: null,
        OR: [{ isDeleted: false }, { isDeleted: null }],
      },
    })
  },
  getCategory: async (args: GetCategoryProps) => {
    return await prisma.categories.findUnique({
      where: {
        slug: args.slug,
        OR: [{ isDeleted: false }, { isDeleted: null }],
      },
      include: {
        childCategories: {
          where: {
            OR: [{ isDeleted: false }, { isDeleted: null }],
          },
        },
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
  updateCategory: async (args: UpdateCategoryProps, session: Session) => {
    return await prisma.categories.update({
      where: { id: args.id },
      data: {
        ...args,
        updatedBy: Number(session.user.id),
      },
    })
  },

  deleteCategory: async (args: DeleteCategoryProps, session: Session) => {
    return await prisma.categories.update({
      where: { id: args.id },
      data: {
        isDeleted: true,
        updatedBy: Number(session.user.id),
      },
    })
  },
}

export default categoryRepository
