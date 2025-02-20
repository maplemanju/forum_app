import { Content } from '@/components/atoms/content'
import CategoryEdit from '@/components/organisms/categoryEdit'
import { getCategory } from '@/process/actions/categoryAction'
import { Alert } from '@/components/atoms/alerts'

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
