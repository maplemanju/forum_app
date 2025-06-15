import Header from '@/components/templates/header'
import { Footer } from '@/components/templates/footer'

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <div id="container" className="single-container">
        {children}
      </div>
      <Footer />
    </>
  )
}
