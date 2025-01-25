import { Content } from '@/common/components/content'
import { Footer } from '@/common/components/footer'
import { getCategory } from '@/process/actions/categoryAction'
import { Breadcrumbs } from '@/common/components/widgets/breadcrumbs'
import { getPostsById } from '@/process/actions/postAction'
import { PostContent } from '@/common/components/widgets/postContent'
import Comments from '@/common/components/widgets/comments'

export default async function PostPage({
  params,
}: {
  params: Promise<{ categoryId: string; postId: string }>
}) {
  const postId = (await params)?.postId
  let post
  if (postId) {
    post = await getPostsById({ id: Number(postId) })
  }
  const categoryId = (await params)?.categoryId
  let category
  if (categoryId) {
    category = await getCategory({ id: Number(categoryId) })
  }
  return (
    <>
      <Content>
        <Breadcrumbs category={category} post={post} />
        <PostContent post={post} />
        {/* <Comments comments={post?.comments || []} /> */}
      </Content>
      <Footer />
    </>
  )
}
