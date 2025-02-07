import { Content } from '@/common/components/content'
import { getCategory } from '@/process/actions/categoryAction'
import { CategoryList } from '@/common/components/widgets/categoryList'
import { Breadcrumbs } from '@/common/components/widgets/breadcrumbs'
import { getPostsByCategory } from '@/process/actions/postAction'
import { PostList } from '@/common/components/widgets/postList'
import CategoryToolbox from '@/common/components/widgets/categoryToolbox'
import CategoryContent from '@/common/components/widgets/categoryContent'
import { Alert } from '@/common/components/alerts'
import { notFound } from 'next/navigation'

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>
}) {
  const categorySlug = (await params)?.categorySlug
  const categoryResponse = await getCategory({ slug: categorySlug })
  if (!categoryResponse.success) {
    return notFound()
  }
  const categoryId = categoryResponse.data?.id
    ? Number(categoryResponse.data?.id)
    : null
  const postsResponse = categoryId
    ? await getPostsByCategory({
        categoryId: categoryId,
      })
    : null

  return (
    <>
      <Alert response={categoryResponse} />
      <Content>
        <Breadcrumbs category={categoryResponse.data} />
        <CategoryToolbox category={categoryResponse.data} />
        <CategoryContent category={categoryResponse.data} />
        <CategoryList categories={categoryResponse.data?.childCategories} />
        {postsResponse && <PostList posts={postsResponse.data} />}
      </Content>
    </>
  )
}
