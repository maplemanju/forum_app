import { Content } from '@/components/templates/content'
import { PostList } from '@/components/organisms/postList'
import { getPostsByKeyword, getRecentPosts } from '@/process/actions/postAction'
import SearchBox from '@/components/molecules/searchBox'
import { PostType } from '@/types/post'
import { ResponseType } from '@/utils/errors'
import { getTags } from '@/process/actions/tagAction'
import { getAllCategories } from '@/process/actions/categoryAction'
import { Suspense } from 'react'
import { Sidebar } from '@/components/templates/sidebar'
import { SidebarSkeleton } from '@/components/molecules/skeletons/sidebarSkeleton'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q: string; sort: string }>
}) {
  const keyword = (await searchParams)?.q
  const sort = (await searchParams)?.sort as 'recent' | 'popular' | 'rated'
  let postsResponse: ResponseType<PostType[]> | undefined
  let keywords: string[] | null = null
  if (keyword) {
    keywords = keyword.split(' ')
    postsResponse = await getPostsByKeyword({ keyword: keywords, sort: sort })
  }
  const tagsResponse = await getTags()

  // for sidebar (suspended)
  const newPostsResponse = getRecentPosts({})
  const categoryListPromise = getAllCategories()
  return (
    <>
      <Content>
        <SearchBox tags={tagsResponse.data} />
        <PostList
          initialPosts={postsResponse?.data}
          showCategory={true}
          label="Featured Posts"
          typeOfList="keyword"
          keywords={keywords}
          showSort={true}
          sort={sort}
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
