import { Content } from '@/components/templates/content'
import { getCategory } from '@/process/actions/categoryAction'
import { Breadcrumbs } from '@/components/molecules/breadcrumbs'
import { getPostBySlug } from '@/process/actions/postAction'
import { PostContent } from '@/components/organisms/postContent'
import CommentList from '@/components/organisms/commentList'
import { getCommentsByPostId } from '@/process/actions/commentAction'
import PostToolbox from '@/components/molecules/postToolbox'
import { Alert } from '@/components/atoms/alerts'
import { notFound } from 'next/navigation'

export default async function PostPage({
  params,
}: {
  params: Promise<{ categorySlug: string; postSlug: string }>
}) {
  const postSlug = (await params)?.postSlug
  const postResponse = await getPostBySlug({ slug: postSlug })
  if (!postResponse.success || !postResponse.data) {
    return notFound()
  }
  const postId = Number(postResponse.data.id)
  const commentsResponse = await getCommentsByPostId({ postId: postId })
  console.log('commentsResponse', commentsResponse)
  console.log('postResponse', postResponse)

  const categorySlug = (await params)?.categorySlug
  const categoryResponse = await getCategory({ slug: categorySlug })

  return (
    <>
      <Alert response={postResponse} />
      <Content>
        <Breadcrumbs
          category={categoryResponse.data}
          post={postResponse.data}
        />
        <PostToolbox post={postResponse.data} />
        <PostContent post={postResponse.data} />
        <CommentList comments={commentsResponse.data} postId={postId} />
      </Content>
    </>
  )
}
