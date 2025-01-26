'use client'

import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Category } from '@/types/category'

interface CategoryToolboxProps {
  parentCategory?: Category | null
}

export default function CategoryToolbox({
  parentCategory,
}: CategoryToolboxProps) {
  const router = useRouter()
  const { data: session } = useSession()

  if (!session) {
    return null
  }

  const handleAddCategory = () => {
    router.push(`/edit?add=true&parentCategorySlug=${parentCategory?.slug}`)
  }

  return (
    <div className="flex justify-end">
      <button
        onClick={handleAddCategory}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 flex items-center gap-2"
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
        onClick={() =>
          router.push(`/post/edit?categorySlug=${parentCategory?.slug}`)
        }
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
