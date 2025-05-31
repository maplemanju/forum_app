import type { Categories } from '@prisma/client'

export type CategoryType = Categories & {
  childCategories?: Categories[]
  parentCategory?: Categories | null
}
