import { Content } from '@/components/templates/content'
import PostEdit from '@/components/organisms/postEdit'
import { getCategory } from '@/process/actions/categoryAction'
import { Alert } from '@/components/atoms/alerts'
import { Sidebar } from '@/components/templates/sidebar'
import { Suspense } from 'react'
import { getRecentPosts } from '@/process/actions/postAction'
import { getAllCategories } from '@/process/actions/categoryAction'

export default async function AddPostPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const categorySlug = (await searchParams)?.categorySlug
  const categoryResponse = await getCategory({ slug: categorySlug as string })

  // for sidebar (suspended)
  const newPostsResponse = getRecentPosts({ take: 5 })
  const categoryListPromise = getAllCategories()

  return (
    <>
      <Alert response={categoryResponse} />
      <Content>
        <PostEdit category={categoryResponse?.data} />
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
