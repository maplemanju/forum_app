'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PostType } from '@/types/post'

interface PostToolboxProps {
  post: PostType | null
}

export default function PostToolbox({ post }: PostToolboxProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  if (!post) return null

  const handleEdit = () => {
    router.push(`/${post.category.slug}/${post.slug}/edit`)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return

    setIsDeleting(true)
    try {
      // TODO: Implement delete functionality
      router.push(`/${post.category.slug}`)
    } catch (error) {
      console.error('Failed to delete post:', error)
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex gap-2 justify-end mt-4">
      <button
        onClick={handleEdit}
        className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
      >
        Edit
      </button>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 disabled:bg-red-300"
      >
        {isDeleting ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  )
}
