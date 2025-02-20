import { CategoryType } from '@/types/category'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

interface CategoryContentProps {
  category?: CategoryType | null
}

const CategoryContent: React.FC<CategoryContentProps> = ({ category }) => {
  return (
    <div className="w-full rounded-lg shadow-sm p-6 mb-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        {category?.categoryName}
      </h1>

      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-400">
          {category?.categoryDescription}
        </p>
      </div>
    </div>
  )
}

export default CategoryContent
