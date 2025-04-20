import { Alert } from '@/components/atoms/alerts'
import ProfileContent from '@/components/organisms/profileContent'
import { Content } from '@/components/templates/content'
import { getUserById } from '@/process/actions/userActions'

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ publicId: string }>
}) {
  const publicId = (await params)?.publicId
  const user = await getUserById({ userId: publicId })
  return (
    <Content>
      <Alert response={user} />
      <ProfileContent user={user.data} />
    </Content>
  )
}
