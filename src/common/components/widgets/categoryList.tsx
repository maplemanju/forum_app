import Link from 'next/link'

import { Category } from '@/types/category'

type Props = {
  categories?: Category[]
}
export const CategoryList = ({ categories }: Props) => {
  const renderCategory = (category: Category) => {
    return (
      <div key={category.id} className="mb-4">
        <div className="bg-white p-4 rounded-lg bg-gray-200">
          <Link href={`/${category.slug}`}>
            <h3 className="text-lg font-semibold text-gray-800">
              {category.categoryName}
            </h3>
          </Link>
          <p className="text-gray-600 text-sm">
            {category.categoryDescription}
          </p>

          {category.childCategories && category.childCategories.length > 0 && (
            <div className="ml-4 mt-2">
              {category.childCategories.map((child) => renderCategory(child))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {categories?.map((category) => renderCategory(category))}
    </div>
  )
}
