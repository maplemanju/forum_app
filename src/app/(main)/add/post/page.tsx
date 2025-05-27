import { Content } from '@/components/templates/content'
import PostEdit from '@/components/organisms/postEdit'
import { getCategory } from '@/process/actions/categoryAction'
import { Alert } from '@/components/atoms/alerts'
import { Sidebar } from '@/components/templates/sidebar'
import { Suspense } from 'react'
import { getRecentPosts } from '@/process/actions/postAction'
import { getAllCategories } from '@/process/actions/categoryAction'
import { SidebarSkeleton } from '@/components/molecules/skeletons/sidebarSkeleton'
import { generateSiteMetadata } from '@/utils/metadata'

export const dynamic = 'force-dynamic'

export default async function AddPostPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const categorySlug = (await searchParams)?.categorySlug || ''
  const categoryResponse = await getCategory({ slug: categorySlug as string })

  // for sidebar (suspended)
  const newPostsResponse = getRecentPosts({})
  const categoryListPromise = getAllCategories()

  return (
    <>
      <Alert response={categoryResponse} />
      <Content>
        <PostEdit category={categoryResponse?.data} />
      </Content>
      <Suspense fallback={<SidebarSkeleton />}>
        <Sidebar
          postListPromise={newPostsResponse}
          categoryListPromise={categoryListPromise}
        />
      </Suspense>
    </>
  )
}

export async function generateMetadata() {
  return generateSiteMetadata({
    title: `Add Post`,
    description: 'Add a new post',
    noIndex: true,
  })
}
