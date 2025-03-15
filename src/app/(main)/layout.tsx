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
      <div className="middle-container">
        <>{children}</>
      </div>
      <Footer />
    </>
  )
}
