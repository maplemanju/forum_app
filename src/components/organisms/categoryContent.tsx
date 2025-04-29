'use client'

import { CategoryType } from '@/types/category'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { MDXContent } from '../templates/MDXContent'
import { mdxSerializer } from '@/utils/mdxSerializer'
import { useState, useEffect } from 'react'
import { CategorySkeleton } from '@/components/molecules/skeletons/categorySkeleton'

interface CategoryContentProps {
  category?: CategoryType | null
}

const CategoryContent: React.FC<CategoryContentProps> = ({ category }) => {
  const [serializedContent, setSerializedContent] =
    useState<MDXRemoteSerializeResult | null>(null)

  useEffect(() => {
    const serializeContent = async () => {
      try {
        if (!category) {
          return
        }
        const mdxSource = await mdxSerializer(
          category.categoryDescription ?? ''
        )
        setSerializedContent(mdxSource)
      } catch (error) {
        console.error('Failed to serialize MDX:', error)
      }
    }

    serializeContent()
  }, [category])

  return (
    <div className="w-full shadow-sm p-6 mb-6 bg-background-secondary">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        {category?.categoryName}
      </h1>

      <div className="post-content mt-3">
        {serializedContent ? (
          <MDXContent source={serializedContent} />
        ) : (
          <CategorySkeleton />
        )}{' '}
      </div>
    </div>
  )
}

export default CategoryContent
