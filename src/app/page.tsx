import { Content } from '@/common/components/content'
import { Footer } from '@/common/components/footer'
import { getAllCategories } from '@/process/actions/categoryAction'
import { CategoryList } from '@/common/components/widgets/categoryList'
import CategoryToolbox from '@/common/components/widgets/categoryToolbox'

export default async function Home() {
  const categories = await getAllCategories()
  return (
    <>
      <Content>
        <CategoryToolbox />
        <CategoryList categories={categories} />
      </Content>
      <Footer />
    </>
  )
}
