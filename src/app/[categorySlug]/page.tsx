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
  params: Promise<{ categorySlug: string }>
}) {
  const categorySlug = (await params)?.categorySlug

  let category
  let posts
  if (categorySlug) {
    category = await getCategory({ slug: categorySlug })
    if (category) {
      posts = await getPostsByCategory({ categoryId: Number(category?.id) })
    }
    console.log('posts', posts)
  }
  return (
    <>
      <Content>
        <Breadcrumbs category={category} />
        <CategoryList categories={category?.childCategories} />
        <PostList posts={posts} categorySlug={categorySlug} />
      </Content>
      <Footer />
    </>
  )
}
