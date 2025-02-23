'use client'

import Link from 'next/link'
import { CategoryType } from '@/types/category'
import { PostType } from '@/types/post'

type BreadcrumbsProps = {
  category?: CategoryType | null
  post?: PostType | null
}

export const Breadcrumbs = ({ category, post }: BreadcrumbsProps) => {
  return (
    <nav className="flex py-3 text-gray-700" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link
            href="/"
            className="inline-flex gap-2 items-center text-sm font-medium text-gray-700 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <span className={`material-symbols-rounded`}>home</span>
          </Link>
        </li>
        {category?.parentCategory && (
          <li>
            <div className="flex items-center">
              <span className={`material-symbols-rounded`}>chevron_right</span>
              <Link
                href={`/${category.parentCategory.slug}`}
                className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 md:ml-2"
              >
                {category.parentCategory.categoryName}
              </Link>
            </div>
          </li>
        )}
        {category && (
          <li>
            <div className="flex items-center">
              <span className={`material-symbols-rounded`}>chevron_right</span>
              <Link
                href={`/${category.slug}`}
                className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 md:ml-2"
              >
                {category.categoryName}
              </Link>
            </div>
          </li>
        )}
        {post && (
          <li>
            <div className="flex items-center">
              <span className={`material-symbols-rounded`}>chevron_right</span>
              <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                {post.postTitle}
              </span>
            </div>
          </li>
        )}
      </ol>
    </nav>
  )
}
