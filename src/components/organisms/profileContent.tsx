'use client'

import Image from 'next/image'
import { Button } from '@/components/atoms/button'
import { useRouter } from 'next/navigation'
import { getImagePath } from '@/utils/getImagePath'
import { User } from '@/types/user'
import { UserInfoCard } from '../molecules/userInfoCard'
import { useSession } from 'next-auth/react'

export default function ProfileContent({ user }: { user?: User }) {
  const router = useRouter()
  const session = useSession()

  return (
    <>
      <div className="p-6 rounded-lg bg-background-secondary">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Profile
          </h1>
        </div>

        <div className="flex gap-8">
          {/* Left Side - Avatar */}
          <div className="flex-shrink-0">
            <div className="relative w-48 h-48 rounded-lg overflow-hidden">
              {user?.userInfo?.profileImage ? (
                <Image
                  src={getImagePath(user.userInfo?.profileImage || '')}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No image</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - User Info */}
          <div className="flex-grow space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                Display Name
              </label>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {user?.userInfo?.displayName}
              </p>
            </div>

            {/* Edit Button */}
            {user?.publicId === session.data?.user?.id && (
              <div className="flex justify-end pt-4 gap-4">
                <Button
                  onClick={() => router.push(`/profile/edit`)}
                  label="Edit Profile"
                  color="primary"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Info - Full card for main comments */}
      <div className="mt-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Post Banner
        </h2>
        <UserInfoCard user={user} fullWidth={true} />
      </div>
    </>
  )
}
