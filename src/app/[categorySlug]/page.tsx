import { Content } from '@/common/components/content'
import { getCategory } from '@/process/actions/categoryAction'
import { CategoryList } from '@/common/components/widgets/categoryList'
import { Breadcrumbs } from '@/common/components/widgets/breadcrumbs'
import { getPostsByCategory } from '@/process/actions/postAction'
import { PostList } from '@/common/components/widgets/postList'
import CategoryToolbox from '@/common/components/widgets/categoryToolbox'
import CategoryContent from '@/common/components/widgets/categoryContent'

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>
}) {
  const categorySlug = (await params)?.categorySlug

  const category = await getCategory({ slug: categorySlug })
  const posts = await getPostsByCategory({
    categoryId: Number(category.data?.id),
  })
  return (
    <>
      <Content>
        <Breadcrumbs category={category.data} />
        <CategoryToolbox category={category.data} />
        <CategoryContent category={category.data} />
        <CategoryList categories={category?.data?.childCategories} />
        <PostList posts={posts} />
      </Content>
    </>
  )
}
