import Header from '../(root)/components/header'
import { Footer } from '@/components/atoms/footer'

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
