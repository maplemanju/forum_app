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
    <nav className="px-4 py-3" aria-label="Breadcrumb">
      <div className="flex items-center gap-2">
        {previousPage && (
          <>
            <Link
              href={previousPage.href || '/'}
              className="text-subtext hover:text-link flex items-center"
            >
              <span className="material-symbols-rounded">
                {previousPage.icon || 'arrow_back'}
              </span>
              {previousPage.name && (
                <span className="ml-1 text-sm">{previousPage.name}</span>
              )}
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
