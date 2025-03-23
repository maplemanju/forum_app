'use client'

import Link from 'next/link'
import { CategoryType } from '@/types/category'

type Props = {
  categories?: CategoryType[]
  label?: string
}
export const CategoryListMinimal = ({
  categories,
  label = 'Categories',
}: Props) => {
  const renderCategory = (category: CategoryType) => {
    return (
      <div key={category.id} className="p-2 border-b border-border-secondary">
        <div>
          <Link href={`/${category.slug}`}>
            <h3 className="text-foreground">{category.categoryName}</h3>
          </Link>
        </div>
      </div>
    )
  }

  return categories && categories.length > 0 ? (
    <>
      <h2 className="divider-label text-lg font-semibold">{label}</h2>

      <div className="[&>*:last-child]:border-b-0">
        {categories?.map((category) => renderCategory(category))}
      </div>
    </>
  ) : (
    <></>
  )
}
