import { Content } from '@/common/components/content'
import { Footer } from '@/common/components/footer'
import { getCategory } from '@/process/actions/categoryAction'
import { Breadcrumbs } from '@/common/components/widgets/breadcrumbs'
import { getPostsById } from '@/process/actions/postAction'
import { PostContent } from '@/common/components/widgets/postContent'
import CommentList from '@/common/components/widgets/commentList'
import { getCommentsByPostId } from '@/process/actions/commentAction'
import { CommentType } from '@/types/comment'
import { PostType } from '@/types/post'
import { Category } from '@/types/category'

export default async function PostPage({
  params,
}: {
  params: Promise<{ categoryId: string; postId: string }>
}) {
  const postId = (await params)?.postId
  let post: PostType | null = null
  let comments: CommentType[] = []
  if (postId) {
    post = await getPostsById({ id: Number(postId) })
    console.log('post', post)
    comments = await getCommentsByPostId({ postId: Number(postId) })
    console.log('comments', comments)
  }
  const categoryId = (await params)?.categoryId
  let category: Category | null = null
  if (categoryId) {
    category = await getCategory({ id: Number(categoryId) })
    console.log('category', category)
  }
  return (
    <>
      <Content>
        <Breadcrumbs category={category} post={post} />
        <PostContent post={post} />
        <CommentList comments={comments} postId={post?.id} />
      </Content>
      <Footer />
    </>
  )
}
