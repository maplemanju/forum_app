import { Content } from '@/components/templates/content'
import CategoryEdit from '@/components/organisms/categoryEdit'
import { getCategory } from '@/process/actions/categoryAction'
import { Alert } from '@/components/atoms/alerts'
import { Sidebar } from '@/components/templates/sidebar'
import { getRecentPosts } from '@/process/actions/postAction'
import { getAllCategories } from '@/process/actions/categoryAction'
import { Suspense } from 'react'

export default async function AddCategoryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const parentCategorySlug = (await searchParams)?.parentCategorySlug

  let parentCategoryResponse
  if (parentCategorySlug) {
    parentCategoryResponse = await getCategory({
      slug: parentCategorySlug as string,
    })
  }

  // for sidebar (suspended)
  const newPostsResponse = getRecentPosts({})
  const categoryListPromise = getAllCategories()

  return (
    <>
      <Content>
        <Alert response={parentCategoryResponse} />
        <CategoryEdit
          category={null}
          parentCategory={parentCategoryResponse?.data}
        />
      </Content>
      <Suspense fallback={<div>Loading...</div>}>
        <Sidebar
          postListPromise={newPostsResponse}
          categoryListPromise={categoryListPromise}
        />
      </Suspense>
    </>
  )
}
