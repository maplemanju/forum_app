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
    const description = stripMarkdown(category.categoryDescription ?? '', 180)
    return (
      <div
        data-testid="sidebar-category-item"
        key={category.id}
        role="listitem"
        className="flex-column border-border-secondary flex justify-between gap-2 border-b p-2"
      >
        <div>
          <Link href={`/${category.slug}`}>
            <h3 className="text-foreground hover:text-link text-lg font-semibold">
              {category.categoryName}
            </h3>
          </Link>

          <p className="text-subtext line-clamp-1 text-sm" title={description}>
            {description}
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

      <div className="[&>*:last-child]:border-b-0" role="list">
        {categories?.map((category) => renderCategory(category))}
      </div>
    </>
  ) : (
    <></>
  )
}
