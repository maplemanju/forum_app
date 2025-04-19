import CategoryEdit from '@/components/organisms/categoryEdit'
import { getCategory } from '@/process/actions/categoryAction'
import { Alert } from '@/components/atoms/alerts'
import { notFound } from 'next/navigation'
import { Content } from '@/components/templates/content'
import { Sidebar } from '@/components/templates/sidebar'
import { generateSiteMetadata } from '@/utils/metadata'

export default async function CategoryEditPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>
}) {
  const categorySlug = (await params)?.categorySlug
  const categoryResponse = await getCategory({ slug: categorySlug })
  if (!categoryResponse.success) {
    return notFound()
  }
  return (
    <>
      <Alert response={categoryResponse} />
      <Content>
        <CategoryEdit
          category={categoryResponse.data}
          parentCategory={categoryResponse.data?.parentCategory}
        />
      </Content>
      <Sidebar />
    </>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string }>
}) {
  const categorySlug = (await params)?.categorySlug
  const categoryResponse = await getCategory({ slug: categorySlug })

  return generateSiteMetadata({
    title: `Edit Category - ${categoryResponse.data?.categoryName}`,
    description: categoryResponse.data?.categoryDescription ?? undefined,
    noIndex: true,
  })
}
