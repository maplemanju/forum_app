import { Content } from '@/components/templates/content'
import { Footer } from '@/components/templates/footer'
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

export default async function Home() {
  const categoriesResponse = await getAllCategories()
  const postsResponse = await getRecentlyUpdatedPosts({ take: 10 })

  // for sidebar (suspended)
  const newPostsResponse = getRecentPosts({ take: 5 })
  return (
    <>
      <Content>
        <CategoryToolbox />
        <CategoryList categories={categoriesResponse.data} />
        <PostList posts={postsResponse.data} showCategory={true} />
      </Content>
      <Suspense fallback={<div>Loading...</div>}>
        <Sidebar
          postListPromise={newPostsResponse}
          categoryListPromise={Promise.resolve(categoriesResponse)}
        />
      </Suspense>
    </>
  )
}
