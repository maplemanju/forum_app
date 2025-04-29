'use client'

import { CategoryType } from '@/types/category'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { MDXContent } from '../templates/MDXContent'

interface CategoryContentProps {
  category?: CategoryType | null
  mdxSource: MDXRemoteSerializeResult
}

const CategoryContent: React.FC<CategoryContentProps> = ({
  category,
  mdxSource,
}) => {
  return (
    <div className="w-full shadow-sm p-6 mb-6 bg-background-secondary">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        {category?.categoryName}
      </h1>

      <div className="post-content mt-3">
        <MDXContent source={mdxSource} />
      </div>
    </div>
  )
}

export default CategoryContent
