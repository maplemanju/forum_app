'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { CategoryType } from '@/types/category'
import { Button } from '@/components/atoms/button'
import { stripMarkdown } from '@/utils/stripMarkdown'

type Props = {
  categories?: CategoryType[]
}
export const CategoryList = ({ categories }: Props) => {
  const { data: session } = useSession()

  const renderCategory = (category: CategoryType) => {
    return (
      <div
        key={category.id}
        className="bg-color-background-tertiary p-3 rounded-lg mb-4 flex flex-column gap-2 justify-between"
      >
        <div>
          <Link href={`/${category.slug}`}>
            <h3 className="text-lg font-semibold text-color-foreground">
              {category.categoryName}
            </h3>
          </Link>

          <p className="text-color-subtext text-sm line-clamp-1">
            {stripMarkdown(category.categoryDescription ?? '', 180)}
          </p>

          {category.childCategories && category.childCategories.length > 0 && (
            <div className="ml-4 mt-2">
              {category.childCategories.map((child) => renderCategory(child))}
            </div>
          )}
        </div>
        {session && (
          <div className="mt-2 text-sm">
            <Button
              size="small"
              color="neutral"
              leftIcon="edit"
              label="Edit"
              linkPath={`/${category.slug}/edit`}
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {categories?.map((category) => renderCategory(category))}
    </div>
  )
}
