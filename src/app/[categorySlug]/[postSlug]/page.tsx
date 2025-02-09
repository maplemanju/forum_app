import { Content } from '@/common/components/content'
import { getCategory } from '@/process/actions/categoryAction'
import { Breadcrumbs } from '@/common/components/widgets/breadcrumbs'
import { getPostBySlug } from '@/process/actions/postAction'
import { PostContent } from '@/common/components/widgets/postContent'
import CommentList from '@/common/components/widgets/commentList'
import { getCommentsByPostId } from '@/process/actions/commentAction'
import PostToolbox from '@/common/components/widgets/postToolbox'
import { Alert } from '@/common/components/alerts'
import { notFound } from 'next/navigation'
import { mdxSerializer } from '@/utils/mdxSerializer'

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
  const mdxSource = await mdxSerializer(postResponse.data.postContent)
  const postId = Number(postResponse.data.id)
  const commentsResponse = await getCommentsByPostId({ postId: postId })

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
        <PostContent post={postResponse.data} mdxSource={mdxSource} />
        <CommentList comments={commentsResponse.data} postId={postId} />
      </Content>
    </>
  )
}
