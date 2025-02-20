import { Content } from '@/components/atoms/content'
import { Footer } from '@/components/atoms/footer'
import { getAllCategories } from '@/process/actions/categoryAction'
import { CategoryList } from '@/components/organisms/categoryList'
import CategoryToolbox from '@/components/molecules/categoryToolbox'
import { PostList } from '@/components/organisms/postList'
import { getRecentlyUpdatedPosts } from '@/process/actions/postAction'
import Header from './(root)/components/header'

export default async function Home() {
  const categoriesResponse = await getAllCategories()
  const postsResponse = await getRecentlyUpdatedPosts()

  return (
    <>
      <Header />
      <Content>
        <CategoryToolbox />
        <CategoryList categories={categoriesResponse.data} />
        <PostList posts={postsResponse.data} showCategory={true} />
      </Content>
      <Footer />
    </>
  )
}
