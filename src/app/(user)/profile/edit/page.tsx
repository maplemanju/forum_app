import { ProfileEdit } from '@/components/organisms/profileEdit'
import { Content } from '@/components/templates/content'
import { getUserById } from '@/process/actions/userActions'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/utils/auth'
import { Alert } from '@/components/atoms/alerts'
import { generateSiteMetadata } from '@/utils/metadata'
import { Drawer } from '@/components/templates/drawer'
import { getAllCategories } from '@/process/actions/categoryAction'

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
  const categoriesResponse = getAllCategories()

  return (
    <>
      <Drawer categoryListPromise={categoriesResponse} />
      <Content>
        <Alert response={user} />
        <ProfileEdit user={user.data} />
      </Content>
    </>
  )
}

export async function generateMetadata() {
  return generateSiteMetadata({
    title: `Edit Profile`,
    description: 'Edit your profile',
    noIndex: true,
  })
}
