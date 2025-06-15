'use client'

import { PostListMinimal } from '@/components/molecules/postListMinimal'
import { CategoryList } from '@/components/organisms/categoryList'
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
    <aside className="bg-background no-scrollbar hidden w-full py-6 md:block">
      <div className="space-y-4 rounded-lg">
        <div>
          {postList && postList.length > 0 && (
            <PostListMinimal posts={postList} label="New Posts" />
          )}
        </div>
        <div>
          {subCategoryList && subCategoryList.length > 0 && (
            <CategoryList categories={subCategoryList} label="Sub Categories" />
          )}
        </div>
        <div>
          {categoryList && categoryList.length > 0 && (
            <CategoryList categories={categoryList} label="Categories" />
          )}
        </div>
      </div>
    </aside>
  )
}
