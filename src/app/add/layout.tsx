import Header from '../(root)/components/header'
import { Footer } from '@/common/components/footer'

export default function AddLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}
