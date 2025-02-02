'use client'

import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Category } from '@/types/category'

interface CategoryToolboxProps {
  category?: Category | null
}

export default function CategoryToolbox({ category }: CategoryToolboxProps) {
  const router = useRouter()
  const { data: session } = useSession()

  if (!session) {
    return null
  }

  const handleAddCategory = () => {
    router.push(`/add/category?parentCategorySlug=${category?.slug}`)
  }

  return (
    <div className="flex justify-end">
      {category && (
        <button
          onClick={() => router.push(`${category.slug}/edit`)}
          className="px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600 flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>
          Edit Category
        </button>
      )}

      <button
        onClick={handleAddCategory}
        className="px-4 py-2 text-sm ml-2 font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 flex items-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
        Add Category
      </button>
      <button
        onClick={() => router.push(`/add/post?categorySlug=${category?.slug}`)}
        className="px-4 py-2 ml-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 flex items-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
        Add Post
      </button>
    </div>
  )
}
