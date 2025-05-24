'use client'

import { useActionState, useState } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { Button } from '@/components/atoms/button'
import { Input } from '@/components/atoms/input'
import { uploadFile } from '@/process/actions/fileUploadAction'
import { useRouter } from 'next/navigation'
import { getImagePath } from '@/utils/getImagePath'
import {
  updateUserProfile,
  UpdateUserProfileResponse,
} from '@/process/actions/userActions'
import { User } from '@/types/user'

export const ProfileEdit = ({ user }: { user: User }) => {
  const router = useRouter()
  const { data: session, update } = useSession()
  const [profileImage, setProfileImage] = useState(
    user.userInfo?.profileImage || ''
  )
  const [isUploading, setIsUploading] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      const response = await uploadFile(file, 'profile')
      if (response.success && response.data?.url) {
        setProfileImage(response.data.url)
        await update({ image: response.data.url })
      }
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (
    prevState: UpdateUserProfileResponse,
    formData: FormData
  ): Promise<UpdateUserProfileResponse> => {
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'User not found',
        type: 'error',
      }
    }
    const response = await updateUserProfile({
      userId: session?.user?.id,
      displayName: formData.get('displayName') as string,
      profileImage: profileImage,
    })
    if (response.success) {
      router.push(`/profile/${response.data?.userId}`)
    }
    return response
  }

  const [formState, formAction] = useActionState(handleSubmit, {
    data: {
      userId: user.publicId,
      displayName: user.userInfo?.displayName || '',
      profileImage: user.userInfo?.profileImage || '',
    },
  })

  return (
    <form action={formAction}>
      <div className="p-6 rounded-lg bg-background-secondary">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Edit Profile
          </h1>
        </div>

        <div className="flex gap-8">
          {/* Left Side - Avatar */}
          <div className="flex-shrink-0">
            <label className="cursor-pointer group">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={isUploading}
              />
              <div className="relative w-48 h-48 rounded-lg overflow-hidden">
                {profileImage ? (
                  <>
                    <Image
                      src={getImagePath(profileImage)}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-all flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100">
                        Change Photo
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center group-hover:bg-gray-300">
                    <span className="text-gray-500">Upload Photo</span>
                  </div>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white">Uploading...</span>
                  </div>
                )}
              </div>
            </label>
          </div>

          {/* Right Side - User Info */}
          <div className="flex-grow space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Display Name
              </label>
              <Input
                id="displayName"
                name="displayName"
                defaultValue={formState.data?.displayName}
                className="w-full text-xl"
                placeholder="Enter your display name"
              />
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4 gap-4">
              <Button
                onClick={() => router.push(`/profile/${user.publicId}`)}
                label="Cancel"
                color="gray"
              />
              <Button type="submit" label="Save Changes" color="primary" />
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
