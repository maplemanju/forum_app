import { Content } from '@/components/templates/content'
import { getCategory, getAllCategories } from '@/process/actions/categoryAction'
import { CategoryList } from '@/components/organisms/categoryList'
import { Breadcrumbs } from '@/components/molecules/breadcrumbs'
import { getPostsByCategory } from '@/process/actions/postAction'
import { PostList } from '@/components/organisms/postList'
import CategoryToolbox from '@/components/molecules/categoryToolbox'
import CategoryContent from '@/components/organisms/categoryContent'
import { Alert } from '@/components/atoms/alerts'
import { notFound } from 'next/navigation'
import { mdxSerializer } from '@/utils/mdxSerializer'
import { Sidebar } from '@/components/templates/sidebar'
import { getRecentPosts } from '@/process/actions/postAction'
import { Suspense } from 'react'
import { SidebarSkeleton } from '@/components/molecules/skeletons/sidebarSkeleton'

export default async function CategoryPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{ sort: string }>
  params: Promise<{ categorySlug: string }>
}) {
  const categorySlug = (await params)?.categorySlug
  const sort = (await searchParams)?.sort as 'recent' | 'popular' | 'rated'
  const categoryResponse = await getCategory({ slug: categorySlug })
  if (!categoryResponse.success) {
    return notFound()
  }
  const categoryId = categoryResponse.data?.id
    ? Number(categoryResponse.data?.id)
    : null
  const postsResponse = categoryId
    ? await getPostsByCategory({
        categoryId: categoryId,
        take: Number(process.env.NEXT_PUBLIC_POST_LIST_PER_PAGE),
        sort: sort,
      })
    : null

  const mdxSource = await mdxSerializer(
    categoryResponse.data?.categoryDescription ?? ''
  )

  // for sidebar (suspended)
  const newPostsResponse = getRecentPosts({})
  const categoryListPromise = getAllCategories()

  return (
    <>
      <Alert response={categoryResponse} />
      <Content>
        <Breadcrumbs category={categoryResponse.data} />
        <CategoryToolbox category={categoryResponse.data} />
        <CategoryContent
          category={categoryResponse.data}
          mdxSource={mdxSource}
        />
        <CategoryList
          categories={categoryResponse.data?.childCategories}
          label="Subcategories"
        />
        {postsResponse && (
          <PostList
            initialPosts={postsResponse.data}
            typeOfList="category"
            categoryId={categoryId}
            label="Posts"
            sort={sort}
            showSort={true}
          />
        )}
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
