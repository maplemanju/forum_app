import { Content } from '@/common/components/content'
import { Footer } from '@/common/components/footer'
import PostEdit from '@/common/components/widgets/postEdit'
import { getCategory } from '@/process/actions/categoryAction'
import { Category } from '@/types/category'

export default async function AddPostPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const categorySlug = (await searchParams)?.categorySlug
  let category: Category | null = null
  if (categorySlug) {
    category = await getCategory({ slug: categorySlug as string })
  }

  return (
    <>
      <Content>
        <PostEdit post={null} category={category} />
      </Content>
      <Footer />
    </>
  )
}
