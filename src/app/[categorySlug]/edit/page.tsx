import EditCategory from '@/common/components/widgets/editCategory'
import { getCategory } from '@/process/actions/categoryAction'

export default async function EditPage({
  params,
  searchParams,
}: {
  params: { categorySlug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const categorySlug = params.categorySlug
  const category = await getCategory({ slug: categorySlug })
  return (
    <EditCategory
      category={category}
      parentCategory={category?.parentCategory}
    />
  )
}
