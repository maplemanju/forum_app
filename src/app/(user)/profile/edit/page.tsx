import { ProfileEdit } from '@/components/organisms/profileEdit'
import { Content } from '@/components/templates/content'
import { getUserById } from '@/process/actions/userActions'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { Alert } from '@/components/atoms/alerts'

export default async function EditProfilePage() {
  const session = await getServerSession(authOptions)
  const publicId = session?.user?.id
  if (!publicId) {
    redirect('/')
  }
  const user = await getUserById({ userId: publicId })
  if (!user.success || !user.data) {
    redirect('/')
  }
  return (
    <Content>
      <Alert response={user} />
      <ProfileEdit publicId={publicId} user={user.data} />
    </Content>
  )
}
