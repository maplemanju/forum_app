'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { CategoryType } from '@/types/category'
import { Button } from '@/components/atoms/button'
import { stripMarkdown } from '@/utils/stripMarkdown'
import { ROLES } from '@/utils/consts'

type Props = {
  categories?: CategoryType[]
  label?: string
}
export const CategoryList = ({ categories, label = 'Categories' }: Props) => {
  const { data: session } = useSession()

  const canEdit = session && session.user.roles?.includes(ROLES.ADMIN)

  const renderCategory = (category: CategoryType) => {
    return (
      <div
        key={category.id}
        className="p-2 flex flex-column gap-2 justify-between border-b border-color-border-secondary"
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
        </div>
        {canEdit && (
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
