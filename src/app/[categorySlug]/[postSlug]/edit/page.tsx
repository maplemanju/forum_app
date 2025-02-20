import { getPostBySlug } from '@/process/actions/postAction'
import PostEdit from '@/components/organisms/postEdit'
import { Alert } from '@/components/atoms/alerts'
import { notFound } from 'next/navigation'
import { Content } from '@/components/atoms/content'

export default async function EditPage({
  params,
}: {
  params: Promise<{ postSlug: string }>
}) {
  const postSlug = (await params)?.postSlug
  const postResponse = await getPostBySlug({ slug: postSlug })
  if (!postResponse.success) {
    return notFound()
  }
  return (
    <>
      <Alert response={postResponse} />
      <Content>
        <PostEdit
          post={postResponse.data}
          category={postResponse.data?.category}
        />
      </Content>
    </>
  )
}
