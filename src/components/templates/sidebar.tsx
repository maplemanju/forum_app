import { getRecentPosts } from '@/process/actions/postAction'
import { getAllCategories, getCategory } from '@/process/actions/categoryAction'
import { PostListMinimal } from '@/components/molecules/postListMinimal'
import { CategoryListMinimal } from '@/components/molecules/categoryListMinimal'
import { Suspense } from 'react'
import { headers } from 'next/headers'
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
    <aside className="py-6 sidebar">
      <div className="p-6 h-full rounded-lg">
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
