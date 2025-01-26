import { Categories } from '@prisma/client'

export type Category = Categories & {
  childCategories?: Category[]
  parentCategory?: Category | null
}
