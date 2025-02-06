import CategoryEdit from '@/common/components/widgets/categoryEdit'
import { getCategory } from '@/process/actions/categoryAction'
import { Alert } from '@/common/components/alerts'

export default async function CategoryEditPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>
}) {
  const categorySlug = (await params)?.categorySlug
  const categoryResponse = await getCategory({ slug: categorySlug })
  return (
    <>
      <Alert response={categoryResponse} />
      <CategoryEdit
        category={categoryResponse.data}
        parentCategory={categoryResponse.data?.parentCategory}
      />
    </>
  )
}
