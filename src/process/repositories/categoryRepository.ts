import prisma from '@/utils/prisma'
import { Session } from 'next-auth'
import { NotFoundError } from '@/utils/errors'

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
  getAllTopLevelCategories: async () => {
    return await prisma.categories.findMany({
      where: {
        parentCategoryId: null,
        isDeleted: false,
      },
    })
  },
  getCategory: async (args: GetCategoryProps) => {
    const category = await prisma.categories.findUnique({
      where: {
        slug: args.slug,
        isDeleted: false,
      },
      include: {
        childCategories: {
          where: {
            isDeleted: false,
          },
        },
        parentCategory: true,
      },
    })
    if (!category) {
      throw new NotFoundError('Category not found')
    }
    return category
  },
  createCategory: async (args: CreateCategoryProps, session: Session) => {
    if (!session.user.id) {
      throw new Error('User ID is required')
    }
    return await prisma.categories.create({
      data: {
        categoryName: args.categoryName,
        categoryDescription: args.categoryDescription,
        slug: args.slug,
        parentCategoryId: args.parentCategoryId,
        createdBy: session.user.id,
        updatedBy: session.user.id,
      },
    })
  },
  updateCategory: async (args: UpdateCategoryProps, session: Session) => {
    if (!session.user.id) {
      throw new Error('User ID is required')
    }
    return await prisma.categories.update({
      where: { id: args.id },
      data: {
        ...args,
        updatedBy: session.user.id,
      },
    })
  },

  deleteCategory: async (args: DeleteCategoryProps, session: Session) => {
    if (!session.user.id) {
      throw new Error('User ID is required')
    }
    return await prisma.categories.update({
      where: { id: args.id },
      data: {
        isDeleted: true,
        updatedBy: session.user.id,
      },
    })
  },
}

export default categoryRepository
