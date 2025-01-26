'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Category } from '@/types/category'
import { PostType } from '@/types/post'
import { createPost } from '@/process/actions/postAction'

interface EditPostProps {
  post: PostType | null
  category: Category | null
}

export default function EditPost({ post, category }: EditPostProps) {
  const router = useRouter()
  const [title, setTitle] = useState(post?.postTitle || '')
  const [content, setContent] = useState(post?.postContent || '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log(title, content, category?.id)
    if (!category) {
      return
    }
    setIsSubmitting(true)
    const response = await createPost({
      postTitle: title,
      postContent: content,
      categoryId: category.id,
    })
    console.log(response)
    router.push(`/${category.slug}/${response.slug}`)
    setIsSubmitting(false)
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-6">
      <h1 className="text-2xl font-bold mb-4">
        {post ? 'Edit Post' : 'Create New Post'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        {category && (
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium mb-1"
            >
              Category
            </label>
            <input
              type="text"
              id="category"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={category.categoryName}
              readOnly
              disabled
              required
            />
          </div>
        )}
        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-1">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}
