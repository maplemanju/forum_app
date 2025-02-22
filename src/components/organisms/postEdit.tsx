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
import { Alert } from '@/components/atoms/alerts'
import { ResponseType } from '@/utils/errors'
import { TextEditor } from '@/components/molecules/textEditor'
import { Button } from '@/components/atoms/button'

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
            id="title"
            type="text"
            name="title"
            defaultValue={formState.data?.postTitle || ''}
            className="w-full px-3 py-2 border border-color-border rounded-md bg-color-background focus:ring-color-border focus:ring-2"
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
              id="category"
              type="text"
              name="category"
              className="w-full px-3 py-2 bg-color-background border border-color-border rounded-md focus:ring-2 focus:ring-blue-500"
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
          <TextEditor
            markdown={content}
            onChangeCallback={setContent}
            isMdxEditor={true}
            canToggleEditor={true}
          />
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium mb-1">
            Tags
          </label>
          <input
            id="tags"
            type="text"
            name="tags"
            defaultValue={
              formState.data?.postTags?.tags
                .map((tag) => `#${tag}`)
                .join(' ') || ''
            }
            className="w-full px-3 py-2 bg-color-background border border-color-border rounded-md focus:ring-color-border focus:ring-2"
          />
        </div>
        <div className="flex justify-end gap-2">
          {post && (
            <Button
              type="button"
              onClick={() => handleDeletePost()}
              label="Delete"
              color="danger"
              leftIcon="delete"
            />
          )}
          <Button
            type="button"
            onClick={() => router.back()}
            label="Cancel"
            color="gray"
            leftIcon="cancel"
          />
          <Button
            type="submit"
            disabled={isPending}
            label={isPending ? 'Saving...' : 'Save'}
            leftIcon="save"
          />
        </div>
      </form>
    </div>
  )
}
