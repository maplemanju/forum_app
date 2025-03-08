import { getPostBySlug } from '@/process/actions/postAction'
import PostEdit from '@/components/organisms/postEdit'
import { Alert } from '@/components/atoms/alerts'
import { notFound } from 'next/navigation'
import { Content } from '@/components/templates/content'
import { Sidebar } from '@/components/templates/sidebar'
import { getRecentPosts } from '@/process/actions/postAction'
import { getAllCategories } from '@/process/actions/categoryAction'
import { Suspense } from 'react'

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

  // for sidebar (suspended)
  const newPostsResponse = getRecentPosts({ take: 5 })
  const categoryListPromise = getAllCategories()

  return (
    <>
      <Alert response={postResponse} />
      <Content>
        <PostEdit
          post={postResponse.data}
          category={postResponse.data?.category}
        />
      </Content>
      <Suspense fallback={<div>Loading...</div>}>
        <Sidebar
          postListPromise={newPostsResponse}
          categoryListPromise={categoryListPromise}
        />
      </Suspense>
    </>
  )
}
