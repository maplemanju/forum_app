import Login from '@/components/organisms/login'
import { generateSiteMetadata } from '@/utils/metadata'

export default function LoginPage() {
  return <Login />
}

export async function generateMetadata() {
  return generateSiteMetadata({
    title: 'Login',
    description: 'Login to your account',
    noIndex: true,
  })
}
