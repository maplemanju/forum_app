'use client'

import { useSession } from 'next-auth/react'
import { CategoryType } from '@/types/category'
import { Button } from '@/components/atoms/button'
import { ROLES } from '@/utils/consts'
interface CategoryToolboxProps {
  category?: CategoryType | null
}

export default function CategoryToolbox({ category }: CategoryToolboxProps) {
  const { data: session } = useSession()

  const canEdit = session && session.user.roles?.includes(ROLES.ADMIN)

  if (!session) return <></>

  return (
    <div className="flex justify-end gap-2">
      {category && canEdit && (
        <>
          <Button
            linkPath={`${category.slug}/edit`}
            label="Edit Category"
            leftIcon="edit"
            size="small"
          />
        </>
      )}
      {canEdit && (
        <Button
          linkPath={`/add/category${
            category ? `?parentCategorySlug=${category.slug}` : ''
          }`}
          label="Add Category"
          leftIcon="add"
          size="small"
        />
      )}
      {category && (
        <Button
          linkPath={`/add/post?categorySlug=${category?.slug}`}
          label="Add Post"
          leftIcon="add"
          size="small"
        />
      )}
    </div>
  )
}
