export type Category = {
  id: number
  categoryName: string
  categoryDescription?: string | null
  childCategories?: Category[]
  parentCategory?: Category | null
}
