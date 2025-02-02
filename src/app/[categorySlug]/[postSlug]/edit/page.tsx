import { getPostBySlug } from '@/process/actions/postAction'
import { PostType } from '@/types/post'
import PostEdit from '@/common/components/widgets/postEdit'

export default async function EditPage({
  params,
}: {
  params: Promise<{ postSlug: string }>
}) {
  const postSlug = (await params)?.postSlug

  let post: PostType | null = null
  if (postSlug) {
    post = await getPostBySlug({ slug: postSlug })
  }
  return <PostEdit post={post} category={post?.category || null} />
}
