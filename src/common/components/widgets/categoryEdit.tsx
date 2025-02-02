'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Category } from '@/types/category'
import { useRouter } from 'next/navigation'
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from '@/process/actions/categoryAction'

interface CategoryEditProps {
  category?: Category | null
  parentCategory?: Category | null
}

export default function CategoryEdit({
  category,
  parentCategory,
}: CategoryEditProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [title, setTitle] = useState(category?.categoryName || '')
  const [description, setDescription] = useState(
    category?.categoryDescription || ''
  )
  const [slug, setSlug] = useState(category?.slug || '')

  if (!session) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log(title, description, slug, category?.parentCategoryId)

    if (category) {
      await updateCategory({
        id: category.id,
        categoryName: title,
        categoryDescription: description,
        slug: slug,
      })
    } else {
      await createCategory({
        categoryName: title,
        categoryDescription: description,
        slug: slug,
        parentCategoryId: parentCategory?.id,
      })
    }
    router.push(`/${slug}`)
  }

  const handleDeleteCategory = async () => {
    if (!category) return
    await deleteCategory({ id: category.id })
    if (parentCategory) {
      router.push(`/${parentCategory.slug}`)
    } else {
      router.push('/')
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-6">
      <h2 className="text-2xl font-semibold mb-6">
        {category ? 'Edit Category' : 'Create New Category'}
      </h2>

      <form onSubmit={handleSubmit}>
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
                id="name"
                value={parentCategory.categoryName}
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
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name
          </label>

          <input
            type="text"
            id="name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            // required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Slug
          </label>
          <input
            type="text"
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
            required
          />
        </div>

        <div className="flex justify-end gap-4">
          {category && (
            <button
              type="button"
              onClick={() => handleDeleteCategory()}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 border border-gray-300 rounded-md hover:bg-red-600"
            >
              Delete
            </button>
          )}
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            {category ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  )
}
