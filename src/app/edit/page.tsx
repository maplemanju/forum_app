import { Content } from '@/common/components/content'
import { Footer } from '@/common/components/footer'
import EditCategory from '@/common/components/widgets/editCategory'
import { getCategory } from '@/process/actions/categoryAction'
import { Category } from '@/types/category'

export default async function EditPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const parentCategorySlug = (await searchParams)?.parentCategorySlug
  let parentCategory: Category | null = null
  if (parentCategorySlug) {
    parentCategory = await getCategory({ slug: parentCategorySlug as string })
  }
  return (
    <>
      <Content>
        <EditCategory category={null} parentCategory={parentCategory} />
      </Content>
      <Footer />
    </>
  )
}
