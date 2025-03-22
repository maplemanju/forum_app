'use client'

import Link from 'next/link'
import { CategoryType } from '@/types/category'
import { PostType } from '@/types/post'

type BreadcrumbsProps = {
  category?: CategoryType | null
  post?: PostType | null
}

export const Breadcrumbs = ({ category, post }: BreadcrumbsProps) => {
  const paths = [
    { name: '', href: '/', icon: 'home' },
    ...(category?.parentCategory
      ? [
          {
            name: category.parentCategory.categoryName,
            href: `/${category.parentCategory.slug}`,
          },
        ]
      : []),
    ...(category
      ? [
          {
            name: category.categoryName,
            href: `/${category.slug}`,
          },
        ]
      : []),
    ...(post
      ? [
          {
            name: post.postTitle,
            href: null,
          },
        ]
      : []),
  ]

  const previousPage = paths[paths.length - 2]
  const currentPage = paths[paths.length - 1]

  return (
    <nav className="py-3 px-4" aria-label="Breadcrumb">
      <div className="flex items-center gap-2">
        {previousPage && (
          <>
            <Link
              href={previousPage.href || '/'}
              className="flex items-center text-color-subtext hover:text-color-link"
            >
              <span className="material-symbols-rounded">
                {previousPage.icon || 'arrow_back'}
              </span>
              {previousPage.name && (
                <span className="ml-1 text-sm">{previousPage.name}</span>
              )}
            </Link>
            <span className="material-symbols-rounded text-color-subtext">
              chevron_right
            </span>
          </>
        )}
        <span className="text-sm text-color-foreground font-medium">
          {currentPage.name}
        </span>
      </div>
    </nav>
  )
}
