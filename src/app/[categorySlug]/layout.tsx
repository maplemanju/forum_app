import Header from '../../components/templates/header'
import { Footer } from '@/components/templates/footer'

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}
