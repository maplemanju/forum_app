import CategoryEdit from '@/common/components/widgets/categoryEdit'
import { getCategory } from '@/process/actions/categoryAction'

export default async function CategoryEditPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>
}) {
  const categorySlug = (await params)?.categorySlug
  const category = await getCategory({ slug: categorySlug })
  return (
    <CategoryEdit
      category={category.data}
      parentCategory={category.data?.parentCategory}
    />
  )
}
