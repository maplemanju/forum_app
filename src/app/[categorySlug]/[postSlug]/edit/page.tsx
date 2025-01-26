import { getPostBySlug } from '@/process/actions/postAction'
import { PostType } from '@/types/post'
import EditPost from '@/common/components/widgets/editPost'

export default async function EditPage({
  params,
}: {
  params: { postSlug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const postSlug = (await params)?.postSlug

  let post: PostType | null = null
  if (postSlug) {
    post = await getPostBySlug({ slug: postSlug })
  }
  return <EditPost post={post} category={post?.category || null} />
}
