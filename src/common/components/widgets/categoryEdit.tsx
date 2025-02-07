'use client'

import { useActionState, useState } from 'react'
import { CategoryType } from '@/types/category'
import { useRouter } from 'next/navigation'
import {
  createCategory,
  deleteCategory,
  updateCategory,
  UpdateCategoryResponse,
} from '@/process/actions/categoryAction'
import { ResponseType } from '@/utils/errors'
import { Alert } from '@/common/components/alerts'

interface CategoryEditProps {
  category?: CategoryType | null
  parentCategory?: CategoryType | null
}

export default function CategoryEdit({
  category,
  parentCategory,
}: CategoryEditProps) {
  const router = useRouter()
  const [alert, setAlert] = useState<ResponseType<unknown>>()

  const handleSubmit = async (
    prevState: UpdateCategoryResponse,
    formData: FormData
  ): Promise<UpdateCategoryResponse> => {
    const args = {
      categoryName: formData.get('categoryName') as string,
      slug: formData.get('slug') as string,
      categoryDescription: formData.get('categoryDescription') as string,
    }

    let response: UpdateCategoryResponse
    if (category) {
      response = await updateCategory({ ...args, id: category.id })
    } else {
      response = await createCategory({
        ...args,
        parentCategoryId: parentCategory?.id,
      })
    }
    if (response.success) {
      router.push(`/${response.data?.slug}`)
      return response
    }
    setAlert(response)
    return prevState
  }

  const [formState, formAction, isPending] = useActionState(handleSubmit, {
    data: {
      categoryName: category?.categoryName || '',
      slug: category?.slug || '',
      categoryDescription: category?.categoryDescription || '',
    },
  })

  const handleDeleteCategory = async () => {
    if (!category) return
    if (!confirm('Are you sure you want to delete this category?')) return
    const response = await deleteCategory({ id: category.id })
    if (response.success) {
      if (parentCategory) {
        router.push(`/${parentCategory.slug}`)
      } else {
        router.push('/')
      }
    } else {
      setAlert(response)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <Alert response={alert} />
      <h2 className="text-2xl font-semibold mb-6">
        {category ? 'Edit Category' : 'Create New Category'}
      </h2>

      <form action={formAction}>
        <div className="mb-4">
          {parentCategory && (
            <div className="mb-4">
              <label
                htmlFor="parentCategory"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Parent Category
              </label>
              <input
                type="text"
                id="parentCategory"
                defaultValue={parentCategory.categoryName}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                // required
                disabled
                readOnly
              />
            </div>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="categoryName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1"
          >
            Name
          </label>

          <input
            type="text"
            id="categoryName"
            name="categoryName"
            defaultValue={formState.data?.categoryName}
            className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            // required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1"
          >
            Slug
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            defaultValue={formState.data?.slug}
            className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="categoryDescription"
            className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1"
          >
            Description
          </label>
          <textarea
            id="categoryDescription"
            name="categoryDescription"
            defaultValue={formState.data?.categoryDescription ?? ''}
            className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
            required
          />
        </div>

        <div className="flex justify-end gap-4">
          {category && (
            <button
              type="button"
              onClick={() => handleDeleteCategory()}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 dark:bg-red-400 border border-gray-300 dark:border-gray-800 rounded-md hover:bg-red-600 dark:hover:bg-red-500"
            >
              Delete
            </button>
          )}
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 dark:bg-blue-400 rounded-md hover:bg-blue-600 dark:hover:bg-blue-500"
          >
            {isPending ? 'Submitting...' : category ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  )
}
