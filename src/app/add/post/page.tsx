import { Content } from '@/common/components/content'
import PostEdit from '@/common/components/widgets/postEdit'
import { getCategory } from '@/process/actions/categoryAction'
import { CategoryType } from '@/types/category'

export default async function AddPostPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const categorySlug = (await searchParams)?.categorySlug
  const category = await getCategory({ slug: categorySlug as string })

  return (
    <>
      <Content>
        <PostEdit post={null} category={category.data} />
      </Content>
    </>
  )
}
