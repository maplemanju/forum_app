import { Content } from '@/components/templates/content'
import PostEdit from '@/components/organisms/postEdit'
import { Alert } from '@/components/atoms/alerts'
import { Sidebar } from '@/components/templates/sidebar'
import { Suspense } from 'react'
import { getRecentPosts } from '@/process/actions/postAction'
import {
  getAllLowLevelCategories,
  getAllCategories,
} from '@/process/actions/categoryAction'
import { SidebarSkeleton } from '@/components/molecules/skeletons/sidebarSkeleton'
import { generateSiteMetadata } from '@/utils/metadata'
import { Drawer } from '@/components/templates/drawer'

export default async function AddPostPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const categorySlug: string =
    ((await searchParams)?.categorySlug as string) || ''
  const categoryListForSelectResponse = await getAllLowLevelCategories()

  // for sidebar (suspended)
  const newPostsResponse = getRecentPosts({})
  const categoryListPromise = getAllCategories()

  return (
    <>
      <Alert response={categoryListForSelectResponse} />
      <Drawer categoryListPromise={categoryListPromise} />
      <Content>
        <PostEdit
          categories={categoryListForSelectResponse.data ?? []}
          categorySlug={categorySlug}
        />
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
