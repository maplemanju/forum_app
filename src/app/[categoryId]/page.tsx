import { Content } from '@/common/components/content'
import { Footer } from '@/common/components/footer'
import { getCategory } from '@/process/actions/categoryAction'
import { CategoryList } from '@/common/components/widgets/categoryList'
import { Breadcrumbs } from '@/common/components/widgets/breadcrumbs'
import { getPostsByCategory } from '@/process/actions/postAction'
import { PostList } from '@/common/components/widgets/postList'

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categoryId: string }>
}) {
  const categoryId = (await params)?.categoryId

  let category
  let posts
  if (categoryId) {
    category = await getCategory({ id: Number(categoryId) })
    posts = await getPostsByCategory({ categoryId: Number(categoryId) })
    console.log('posts', posts)
  }
  return (
    <>
      <Content>
        <Breadcrumbs category={category} />
        <CategoryList categories={category?.childCategories} />
        <PostList posts={posts} />
      </Content>
      <Footer />
    </>
  )
}
