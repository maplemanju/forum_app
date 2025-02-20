import { Content } from '@/components/atoms/content'
import PostEdit from '@/components/organisms/postEdit'
import { getCategory } from '@/process/actions/categoryAction'
import { CategoryType } from '@/types/category'
import { Alert } from '@/components/atoms/alerts'

export default async function AddPostPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const categorySlug = (await searchParams)?.categorySlug
  const categoryResponse = await getCategory({ slug: categorySlug as string })

  return (
    <>
      <Alert response={categoryResponse} />
      <Content>
        <PostEdit category={categoryResponse?.data} />
      </Content>
    </>
  )
}
