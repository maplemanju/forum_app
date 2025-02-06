import { Content } from '@/common/components/content'
import PostEdit from '@/common/components/widgets/postEdit'
import { getCategory } from '@/process/actions/categoryAction'
import { CategoryType } from '@/types/category'
import { Alert } from '@/common/components/alerts'

export default async function AddPostPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const categorySlug = (await searchParams)?.categorySlug
  const category = await getCategory({ slug: categorySlug as string })

  return (
    <>
      <Alert response={category} />
      <Content>
        <PostEdit post={null} category={category.data} />
      </Content>
    </>
  )
}
