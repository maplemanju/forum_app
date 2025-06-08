'use client'

import Image from 'next/image'
import { Button } from '@/components/atoms/button'
import { useRouter } from 'next/navigation'
import { config } from '@/utils/config'
import { User } from '@/types/user'
import { UserInfoCard } from '../molecules/userInfoCard'
import { useSession } from 'next-auth/react'

export default function ProfileContent({ user }: { user?: User }) {
  const router = useRouter()
  const session = useSession()

  return (
    <>
      <div className="bg-background-secondary rounded-lg p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Profile
          </h1>
        </div>

        <div className="flex gap-8">
          {/* Left Side - Avatar */}
          <div className="flex-shrink-0">
            <div className="relative h-48 w-48 overflow-hidden rounded-lg">
              {user?.userInfo?.profileImage ? (
                <Image
                  src={`${config.s3Path}${user.userInfo?.profileImage || ''}`}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-200">
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
              <div className="flex justify-end gap-4 pt-4">
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
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          Post Banner
        </h2>
        <UserInfoCard user={user} fullWidth={true} />
      </div>
    </>
  )
}
