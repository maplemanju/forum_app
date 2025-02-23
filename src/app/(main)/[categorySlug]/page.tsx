import { Content } from '@/components/templates/content'
import { getCategory } from '@/process/actions/categoryAction'
import { CategoryList } from '@/components/organisms/categoryList'
import { Breadcrumbs } from '@/components/molecules/breadcrumbs'
import { getPostsByCategory } from '@/process/actions/postAction'
import { PostList } from '@/components/organisms/postList'
import CategoryToolbox from '@/components/molecules/categoryToolbox'
import CategoryContent from '@/components/organisms/categoryContent'
import { Alert } from '@/components/atoms/alerts'
import { notFound } from 'next/navigation'
import { mdxSerializer } from '@/utils/mdxSerializer'

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

  const mdxSource = await mdxSerializer(
    categoryResponse.data?.categoryDescription ?? ''
  )

  return (
    <>
      <Alert response={categoryResponse} />
      <Content>
        <Breadcrumbs category={categoryResponse.data} />
        <CategoryToolbox category={categoryResponse.data} />
        <CategoryContent
          category={categoryResponse.data}
          mdxSource={mdxSource}
        />
        <CategoryList categories={categoryResponse.data?.childCategories} />
        {postsResponse && <PostList posts={postsResponse.data} />}
      </Content>
    </>
  )
}
