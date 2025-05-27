import { Content } from '@/components/templates/content'
import { getAllCategories, getCategory } from '@/process/actions/categoryAction'
import { Breadcrumbs } from '@/components/molecules/breadcrumbs'
import { getPostBySlug, getRecentPosts } from '@/process/actions/postAction'
import { PostContent } from '@/components/organisms/postContent'
import CommentList from '@/components/organisms/commentList'
import { getCommentsByPostId } from '@/process/actions/commentAction'
import PostToolbox from '@/components/molecules/postToolbox'
import { Alert } from '@/components/atoms/alerts'
import { notFound } from 'next/navigation'
import { Sidebar } from '@/components/templates/sidebar'
import { Suspense } from 'react'
import { SidebarSkeleton } from '@/components/molecules/skeletons/sidebarSkeleton'
import { generateSiteMetadata } from '@/utils/metadata'

export const dynamic = 'force-dynamic'

export default async function PostPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{ page: string; sort: string }>
  params: Promise<{ categorySlug: string; postSlug: string }>
}) {
  const postSlug = (await params)?.postSlug
  const postResponse = await getPostBySlug({ slug: postSlug })
  if (!postResponse.success || !postResponse.data) {
    return notFound()
  }
  const postId = Number(postResponse.data.id)
  const page = (await searchParams)?.page ?? '0'
  const sort = ((await searchParams)?.sort ?? 'oldest') as
    | 'oldest'
    | 'newest'
    | 'popular'
    | 'rated'
  const commentsResponse = await getCommentsByPostId({
    postId: postId,
    take: Number(process.env.NEXT_PUBLIC_COMMENT_LIST_PER_PAGE || 5),
    skip:
      Number(page) * Number(process.env.NEXT_PUBLIC_COMMENT_LIST_PER_PAGE || 5),
    sort: sort,
  })
  const categorySlug = (await params)?.categorySlug
  const categoryResponse = await getCategory({ slug: categorySlug })

  // for sidebar (suspended)
  const newPostsResponse = getRecentPosts({})
  const categoryListPromise = getAllCategories()
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
        <CommentList
          comments={commentsResponse.data}
          postId={postId}
          commentCount={postResponse.data._count.comments}
          sort={sort}
        />
      </Content>
      <Suspense fallback={<SidebarSkeleton />}>
        <Sidebar
          postListPromise={newPostsResponse}
          categoryListPromise={categoryListPromise}
          subCategoryListPromise={Promise.resolve(categoryResponse)}
        />
      </Suspense>
    </>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ postSlug: string }>
}) {
  const postSlug = (await params)?.postSlug
  const post = await getPostBySlug({ slug: postSlug })

  return generateSiteMetadata({
    title: post.data?.postTitle,
    description: post.data?.postContent,
    image: post.data?.heroImage ?? undefined,
    type: 'article',
    publishedTime: post.data?.publishedAt?.toISOString(),
    modifiedTime: post.data?.updatedAt?.toISOString(),
    author: post.data?.createdUser.userInfo?.displayName,
    category: post.data?.category.categoryName,
  })
}
