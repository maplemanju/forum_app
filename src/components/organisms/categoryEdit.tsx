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
import { Alert } from '@/components/atoms/alerts'
import { Button } from '@/components/atoms/button'

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
    <div className="w-full mx-auto p-6">
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
                className="block text-sm font-medium text-color-subtext mb-1"
              >
                Parent Category
              </label>

              <input
                type="text"
                id="parentCategory"
                defaultValue={parentCategory.categoryName}
                className="w-full px-3 py-2 border border-color-border rounded-md focus:ring-2 focus:ring-blue-500"
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
            className="block text-sm font-medium text-color-subtext mb-1"
          >
            Name
          </label>

          <input
            type="text"
            id="categoryName"
            name="categoryName"
            defaultValue={formState.data?.categoryName}
            className="w-full px-3 py-2 bg-color-background border border-color-border rounded-md focus:ring-2 focus:ring-blue-500"
            // required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-color-subtext mb-1"
          >
            Slug
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            defaultValue={formState.data?.slug}
            className="w-full px-3 py-2 bg-color-background border border-color-border rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="categoryDescription"
            className="block text-sm font-medium text-color-subtext mb-1"
          >
            Description
          </label>
          <textarea
            id="categoryDescription"
            name="categoryDescription"
            defaultValue={formState.data?.categoryDescription ?? ''}
            className="w-full px-3 py-2 bg-color-background border border-color-border rounded-md focus:ring-2 focus:ring-blue-500 h-32"
            required
          />
        </div>

        <div className="flex justify-end gap-4">
          {category && (
            <Button
              type="button"
              onClick={() => handleDeleteCategory()}
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
            label={isPending ? 'Submitting...' : category ? 'Update' : 'Create'}
            leftIcon="save"
          />
        </div>
      </form>
    </div>
  )
}
