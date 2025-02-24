import { Content } from '@/components/templates/content'
import { Footer } from '@/components/templates/footer'
import { getAllCategories } from '@/process/actions/categoryAction'
import { CategoryList } from '@/components/organisms/categoryList'
import CategoryToolbox from '@/components/molecules/categoryToolbox'
import { PostList } from '@/components/organisms/postList'
import { getRecentlyUpdatedPosts } from '@/process/actions/postAction'
import Header from '../../components/templates/header'

export default async function Home() {
  const categoriesResponse = await getAllCategories()
  const postsResponse = await getRecentlyUpdatedPosts()

  return (
    <>
      <Content>
        <CategoryToolbox />
        <CategoryList categories={categoriesResponse.data} />
        <PostList posts={postsResponse.data} showCategory={true} />
      </Content>
    </>
  )
}
