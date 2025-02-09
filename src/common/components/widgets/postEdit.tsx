'use client'

import { useActionState, useRef, useState } from 'react'
import { redirect, useRouter } from 'next/navigation'
import { CategoryType } from '@/types/category'
import { PostType } from '@/types/post'
import {
  createPost,
  deletePost,
  updatePost,
  UpdatePostResponse,
} from '@/process/actions/postAction'
import { Alert } from '@/common/components/alerts'
import { ResponseType } from '@/utils/errors'
import { TextEditor } from '@/common/components/textEditor'

interface PostEditProps {
  post?: PostType
  category?: CategoryType
}

export default function PostEdit({ post, category }: PostEditProps) {
  const router = useRouter()
  const [alert, setAlert] = useState<ResponseType<unknown>>()
  const [content, setContent] = useState<string>(post?.postContent || '')

  const handleSubmit = async (
    prevState: UpdatePostResponse,
    formData: FormData
  ): Promise<UpdatePostResponse> => {
    if (!category) {
      return { success: false }
    }
    const tags = formData.get('tags') as string

    const args = {
      id: post?.id,
      postTitle: formData.get('title') as string,
      postContent: content,
      categoryId: category.id,

      postTags: {
        postId: post?.id,
        tags: tags.split(' ').map((tag) => tag.replace('#', '')),
      },
    }
    let response: UpdatePostResponse
    if (post) {
      response = await updatePost({ ...args, id: post.id })
    } else {
      response = await createPost({ ...args, categoryId: category.id })
    }
    if (response.success) {
      router.push(`/${category.slug}/${response.data?.slug}`)
      return response
    }
    setAlert(response)
    return prevState
  }

  const [formState, formAction, isPending] = useActionState(handleSubmit, {
    data: {
      id: post?.id,
      postTitle: post?.postTitle || '',
      postContent: content || '',
      postTags: post?.postTags,
    },
  })

  const handleDeletePost = async () => {
    if (!post || !category) return
    if (!confirm('Are you sure you want to delete this post?')) return
    const response = await deletePost({ id: post.id })
    if (response.success) {
      router.push(`/${category.slug}`)
    } else {
      setAlert(response)
    }
  }

  return (
    <div className="w-full mx-auto p-6">
      <Alert response={alert} />
      <h1 className="text-2xl font-bold mb-4">
        {post ? 'Edit Post' : 'Create New Post'}
      </h1>
      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title
          </label>
          <input
            type="text"
            name="title"
            defaultValue={formState.data?.postTitle || ''}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-800 rounded-md"
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
              name="category"
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue={category.categoryName}
              readOnly
              disabled
              required
            />
          </div>
        )}
        <div className="post-content ">
          <label htmlFor="content" className="block text-sm font-medium mb-1">
            Content
          </label>
          {/* <textarea
            name="content"
            defaultValue={formState.data?.postContent || ''}
            rows={10}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-800 rounded-md"
            required
          /> */}
          <TextEditor
            markdown={content}
            onChangeCallback={(markdown) => setContent(markdown)}
            isMdxEditor={true}
            canToggleEditor={true}
          />
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium mb-1">
            Tags
          </label>
          <input
            type="text"
            name="tags"
            defaultValue={
              formState.data?.postTags?.tags
                .map((tag) => `#${tag}`)
                .join(' ') || ''
            }
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-800 rounded-md"
          />
        </div>
        <div className="flex justify-end gap-2">
          {post && (
            <button
              type="button"
              onClick={() => handleDeletePost()}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 dark:bg-red-400 rounded-md hover:bg-red-600 dark:hover:bg-red-500 disabled:bg-red-300"
            >
              Delete
            </button>
          )}
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 dark:bg-blue-400 rounded-md hover:bg-blue-600 dark:hover:bg-blue-500 disabled:bg-blue-300"
          >
            {isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}
