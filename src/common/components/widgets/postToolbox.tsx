'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { PostType } from '@/types/post'
import { deletePost } from '@/process/actions/postAction'

interface PostToolboxProps {
  post?: PostType
}

export default function PostToolbox({ post }: PostToolboxProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [isDeleting, setIsDeleting] = useState(false)

  if (!post || !session) return <></>

  const handleEdit = () => {
    router.push(`/${post.category.slug}/${post.slug}/edit`)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return

    setIsDeleting(true)
    await deletePost({ id: post.id })
    router.push(`/${post.category.slug}`)
    setIsDeleting(false)
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
