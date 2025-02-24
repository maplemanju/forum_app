import Header from '@/components/templates/header'
import { Footer } from '@/components/templates/footer'
import { Sidebar } from '@/components/templates/sidebar'

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <div className=" max-w-7xl mx-auto grid grid-cols-[1fr_300px] gap-4">
        <div>{children}</div>
        <Sidebar />
      </div>
      <Footer />
    </>
  )
}
