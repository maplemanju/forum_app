import { Content } from '@/components/templates/content'
import { getAllCategories } from '@/process/actions/categoryAction'
import { CategoryList } from '@/components/organisms/categoryList'
import CategoryToolbox from '@/components/molecules/categoryToolbox'
import { PostList } from '@/components/organisms/postList'
import {
  getRecentlyUpdatedPosts,
  getRecentPosts,
} from '@/process/actions/postAction'
import { Sidebar } from '@/components/templates/sidebar'
import { Suspense } from 'react'
import { SidebarSkeleton } from '@/components/molecules/skeletons/sidebarSkeleton'
import { generateSiteMetadata } from '@/utils/metadata'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const categoriesResponse = await getAllCategories()
  const postsResponse = await getRecentlyUpdatedPosts({
    take: Number(process.env.NEXT_PUBLIC_POST_LIST_PER_PAGE || 5),
  })

  // for sidebar (suspended)
  const newPostsResponse = getRecentPosts({})
  return (
    <>
      <Content>
        <CategoryToolbox />
        <CategoryList categories={categoriesResponse.data} />
        <PostList
          initialPosts={postsResponse.data}
          showCategory={true}
          label="Feeds"
          typeOfList="recent"
        />
      </Content>
      <Suspense fallback={<SidebarSkeleton />}>
        <Sidebar
          postListPromise={newPostsResponse}
          categoryListPromise={Promise.resolve(categoriesResponse)}
        />
      </Suspense>
    </>
  )
}

export async function generateMetadata() {
  return generateSiteMetadata({
    title: 'A modern forum app',
    description: 'A modern forum app.',
  })
}
