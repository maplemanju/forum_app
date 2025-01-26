import { Content } from '@/common/components/content'
import { Footer } from '@/common/components/footer'
import { getCategory } from '@/process/actions/categoryAction'
import { Breadcrumbs } from '@/common/components/widgets/breadcrumbs'
import { getPostBySlug } from '@/process/actions/postAction'
import { PostContent } from '@/common/components/widgets/postContent'
import CommentList from '@/common/components/widgets/commentList'
import { getCommentsByPostId } from '@/process/actions/commentAction'
import { CommentType } from '@/types/comment'
import { PostType } from '@/types/post'
import { Category } from '@/types/category'
import PostToolbox from '@/common/components/widgets/postToolbox'

export default async function PostPage({
  params,
}: {
  params: Promise<{ categorySlug: string; postSlug: string }>
}) {
  const postSlug = (await params)?.postSlug
  let post: PostType | null = null
  let comments: CommentType[] = []
  if (postSlug) {
    post = await getPostBySlug({ slug: postSlug })
    console.log('post', post)
    if (post) {
      comments = await getCommentsByPostId({ postId: Number(post?.id) })
    }
    console.log('comments', comments)
  }
  const categorySlug = (await params)?.categorySlug
  let category: Category | null = null
  if (categorySlug) {
    category = await getCategory({ slug: categorySlug })
    console.log('category', category)
  }
  return (
    <>
      <Content>
        <Breadcrumbs category={category} post={post} />
        <PostToolbox post={post} />
        <PostContent post={post} />
        <CommentList comments={comments} postId={post?.id} />
      </Content>
      <Footer />
    </>
  )
}
