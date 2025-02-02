import { Content } from '@/common/components/content'
import { Footer } from '@/common/components/footer'
import { getAllCategories } from '@/process/actions/categoryAction'
import { CategoryList } from '@/common/components/widgets/categoryList'
import CategoryToolbox from '@/common/components/widgets/categoryToolbox'
import { PostList } from '@/common/components/widgets/postList'
import {
  getRecentPosts,
  getRecentlyUpdatedPosts,
} from '@/process/actions/postAction'

export default async function Home() {
  const categories = await getAllCategories()
  const posts = await getRecentlyUpdatedPosts()
  return (
    <>
      <Content>
        <CategoryToolbox />
        <CategoryList categories={categories} />
        <PostList posts={posts} />
      </Content>
      <Footer />
    </>
  )
}
