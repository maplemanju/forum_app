import CategoryEdit from '@/common/components/widgets/categoryEdit'
import { getCategory } from '@/process/actions/categoryAction'

export default async function CategoryEditPage({
  params,
}: {
  params: { categorySlug: string }
}) {
  const categorySlug = params.categorySlug
  const category = await getCategory({ slug: categorySlug })
  return (
    <CategoryEdit
      category={category}
      parentCategory={category?.parentCategory}
    />
  )
}
