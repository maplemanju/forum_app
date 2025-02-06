import { Content } from '@/common/components/content'
import { getCategory } from '@/process/actions/categoryAction'
import { Breadcrumbs } from '@/common/components/widgets/breadcrumbs'
import { getPostBySlug } from '@/process/actions/postAction'
import { PostContent } from '@/common/components/widgets/postContent'
import CommentList from '@/common/components/widgets/commentList'
import { getCommentsByPostId } from '@/process/actions/commentAction'
import PostToolbox from '@/common/components/widgets/postToolbox'

export default async function PostPage({
  params,
}: {
  params: Promise<{ categorySlug: string; postSlug: string }>
}) {
  const postSlug = (await params)?.postSlug
  const post = await getPostBySlug({ slug: postSlug })
  const comments = await getCommentsByPostId({
    postId: Number(post?.id),
  })
  const categorySlug = (await params)?.categorySlug
  const category = await getCategory({ slug: categorySlug })
  return (
    <>
      <Content>
        <Breadcrumbs category={category.data} post={post} />
        <PostToolbox post={post} />
        <PostContent post={post} />
        <CommentList comments={comments} postId={post?.id} />
      </Content>
    </>
  )
}
