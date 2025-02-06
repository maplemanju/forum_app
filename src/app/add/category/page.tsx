import { Content } from '@/common/components/content'
import CategoryEdit from '@/common/components/widgets/categoryEdit'
import { getCategory } from '@/process/actions/categoryAction'
import { Alert } from '@/common/components/alerts'

export default async function AddCategoryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const parentCategorySlug = (await searchParams)?.parentCategorySlug

  let parentCategoryResponse
  if (parentCategorySlug) {
    parentCategoryResponse = await getCategory({
      slug: parentCategorySlug as string,
    })
  }

  return (
    <>
      <Content>
        <Alert response={parentCategoryResponse} />
        <CategoryEdit
          category={null}
          parentCategory={parentCategoryResponse?.data}
        />
      </Content>
    </>
  )
}
