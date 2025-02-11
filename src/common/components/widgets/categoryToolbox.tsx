'use client'

import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { CategoryType } from '@/types/category'
import { Button } from '@/common/components/button'
interface CategoryToolboxProps {
  category?: CategoryType | null
}

export default function CategoryToolbox({ category }: CategoryToolboxProps) {
  const router = useRouter()
  const { data: session } = useSession()

  if (!session) {
    return null
  }

  const handleAddCategory = () => {
    router.push(
      `/add/category${category ? `?parentCategorySlug=${category.slug}` : ''}`
    )
  }

  return (
    <div className="flex justify-end gap-2">
      {category && (
        <Button
          onClick={() => router.push(`${category.slug}/edit`)}
          label="Edit Category"
          leftIcon="edit"
          size="small"
        />
      )}

      <Button
        onClick={handleAddCategory}
        label="Add Category"
        leftIcon="add"
        size="small"
      />
      <Button
        onClick={() => router.push(`/add/post?categorySlug=${category?.slug}`)}
        label="Add Post"
        leftIcon="add"
        size="small"
      />
    </div>
  )
}
