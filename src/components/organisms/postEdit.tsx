'use client'

import {
  useActionState,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react'
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
import { HeroImageUpload } from '@/components/molecules/heroImageUpload'
import { Select } from '../atoms/select'

interface PostEditProps {
  post?: PostType
  categories: CategoryType[]
  categorySlug?: string
}

export default function PostEdit({
  post,
  categorySlug,
  categories,
}: PostEditProps) {
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
    const tags = formData.get('tags') as string
    const selectedCategorySlug = formData.get('category') as string
    const category = categories.find(
      (category) => category.slug === selectedCategorySlug
    )
    if (!category) {
      return {
        success: false,
      }
    }

    const args = {
      postTitle: formData.get('title') as string,
      categoryId: category.id,
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
      response = await createPost(args)
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
    if (!post) return
    if (!confirm('Are you sure you want to delete this post?')) return
    const response = await deletePost({ id: post.id })
    if (response.success) {
      router.push(`/`)
    } else {
      setAlert(response)
    }
  }

  const handleImageUpload = (url: string) => {
    setHeroImage(url)
  }

  const categoryOptions = useMemo(() => {
    return categories.map((category: CategoryType) => {
      let label = category.categoryName
      if (category.parentCategory) {
        label = `[${category.parentCategory.categoryName}] ${category.categoryName}`
      }
      return {
        value: category.slug,
        label,
      }
    })
  }, [categories])

  // Return if user doesn't have permission
  if (!session || (!canEdit && Boolean(post))) {
    return <></>
  }
  return (
    <div className="mx-auto w-full p-6">
      <Alert response={alert} />
      <h1 className="mb-4 text-2xl font-bold">
        {post ? 'Edit Post' : 'Create New Post'}
      </h1>
      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-medium">
            Title
          </label>
          <input
            id="title"
            type="text"
            name="title"
            defaultValue={formState.data?.postTitle || ''}
            className="border-border bg-background focus:ring-border w-full rounded-md border px-3 py-2 focus:ring-2"
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="mb-1 block text-sm font-medium">
            Category
          </label>
          <Select
            id="category"
            name="category"
            defaultValue={categorySlug}
            className="bg-background border-border w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            options={categoryOptions}
          />
        </div>

        <div>
          <label
            htmlFor="hero-image-upload"
            className="mb-1 block text-sm font-medium"
          >
            Hero Image
          </label>
          <HeroImageUpload
            onUpload={handleImageUpload}
            currentImage={heroImage}
          />
        </div>

        <div className="post-content">
          <div className="mb-1 block text-sm font-medium">Content</div>
          <TextEditor
            markdown={content}
            onChangeCallback={handleContentChange}
          />
        </div>

        <div>
          <label htmlFor="tags" className="mb-1 block text-sm font-medium">
            Tags
          </label>
          <input
            id="tags"
            type="text"
            name="tags"
            defaultValue={
              formState.data?.postTags?.tags
                .map((tag: string) => `#${tag}`)
                .join(' ') || ''
            }
            className="bg-background border-border focus:ring-border w-full rounded-md border px-3 py-2 focus:ring-2"
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
              aria-label="Delete the post"
            />
          )}
          <Button
            type="button"
            onClick={() => router.back()}
            label="Cancel"
            color="gray"
            leftIcon="cancel"
            aria-label="Cancel editing"
          />
          <Button
            type="submit"
            disabled={isPending}
            label={isPending ? 'Saving...' : 'Save'}
            leftIcon="save"
            aria-label={isPending ? 'Saving...' : 'Save'}
            aria-live="polite"
          />
        </div>
      </form>
    </div>
  )
}
