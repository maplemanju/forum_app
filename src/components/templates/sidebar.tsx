'use client'

import { PostListMinimal } from '@/components/molecules/postListMinimal'
import { CategoryListMinimal } from '@/components/molecules/categoryListMinimal'
import { CategoryType } from '@/types/category'
import { PostType } from '@/types/post'
import { ResponseType } from '@/utils/errors'
import { use } from 'react'

type SidebarProps = {
  postListPromise?: Promise<ResponseType<PostType[]>>
  categoryListPromise?: Promise<ResponseType<CategoryType[]>>
  subCategoryListPromise?: Promise<ResponseType<CategoryType>>
}
export const Sidebar = ({
  postListPromise,
  categoryListPromise,
  subCategoryListPromise,
}: SidebarProps) => {
  const postListResponse = postListPromise ? use(postListPromise) : null
  const categoryListResponse = categoryListPromise
    ? use(categoryListPromise)
    : null
  const subCategoryListResponse = subCategoryListPromise
    ? use(subCategoryListPromise)
    : null
  const postList = postListResponse?.data
  const categoryList = categoryListResponse?.data
  const subCategoryList = subCategoryListResponse?.data?.childCategories
  return (
    <aside className="sidebar py-6">
      <div className="h-full rounded-lg p-6">
        {postList && postList.length > 0 && (
          <PostListMinimal posts={postList} label="New Posts" />
        )}
        {categoryList && categoryList.length > 0 && (
          <CategoryListMinimal categories={categoryList} label="Categories" />
        )}
        {subCategoryList && subCategoryList.length > 0 && (
          <CategoryListMinimal
            categories={subCategoryList}
            label="Sub Categories"
          />
        )}
      </div>
    </aside>
  )
}
