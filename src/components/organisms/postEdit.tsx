'use client'

import { useActionState, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
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
import { useSession } from 'next-auth/react'
import { ROLES } from '@/utils/consts'
import { notFound } from 'next/navigation'
import { HeroImageUpload } from '@/components/molecules/heroImageUpload'

interface PostEditProps {
  post?: PostType
  category?: CategoryType
}

export default function PostEdit({ post, category }: PostEditProps) {
  const router = useRouter()
  const [alert, setAlert] = useState<ResponseType<unknown>>()
  const [content, setContent] = useState<string>('')
  const { data: session } = useSession()
  const [heroImage, setHeroImage] = useState(post?.heroImage)

  // Allow access if user is either the post creator OR an admin
  const canEdit =
    session &&
    (session.user.id === post?.createdBy ||
      session.user.roles?.includes(ROLES.ADMIN))

  useEffect(() => {
    if (post?.postContent) {
      setContent(post.postContent)
    }
  }, [post])

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent)
  }, [])

  const handleSubmit = async (
    prevState: UpdatePostResponse,
    formData: FormData
  ): Promise<UpdatePostResponse> => {
    if (!category) {
      return { success: false }
    }
    const tags = formData.get('tags') as string

    const args = {
      postTitle: formData.get('title') as string,
      postContent: content,
      heroImage: heroImage || null,
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
    return { data: args } as UpdatePostResponse
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

  const handleImageUpload = (url: string) => {
    setHeroImage(url)
  }

  // Return if user doesn't have permission
  if (!session || !category || (!canEdit && Boolean(post))) {
    return <></>
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
        <div>
          <label className="block text-sm font-medium mb-1">Hero Image</label>
          <HeroImageUpload
            onUpload={handleImageUpload}
            currentImage={heroImage}
          />
          <input type="hidden" name="heroImage" value={heroImage || ''} />
        </div>

        <div className="post-content ">
          <div className="block text-sm font-medium mb-1">Content</div>
          <TextEditor
            markdown={content}
            onChangeCallback={handleContentChange}
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
