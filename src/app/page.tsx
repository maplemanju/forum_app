import { Content } from '@/common/components/content'
import { Footer } from '@/common/components/footer'
import { getAllCategories } from '@/process/actions/categoryAction'
import { CategoryList } from '@/common/components/widgets/categoryList'
import CategoryToolbox from '@/common/components/widgets/categoryToolbox'
import { PostList } from '@/common/components/widgets/postList'
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
