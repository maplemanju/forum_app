'use client'

import Link from 'next/link'
import Image from 'next/image'
import { config } from '@/utils/config'

export const UserAndIcon = ({
  displayName,
  publicId,
  profileImage,
  size = 'sm',
}: {
  displayName: string
  publicId: string
  profileImage?: string | null
  size?: 'xs' | 'sm'
}) => {
  return (
    <Link
      href={`/profile/${publicId}`}
      className={`flex items-center gap-2 text-${size} text-foreground transition-opacity hover:opacity-80`}
    >
      <div className="bg-border-secondary h-6 w-6 overflow-hidden rounded-full">
        {profileImage ? (
          <Image
            src={`${config.s3Path}${profileImage}`}
            alt={displayName || 'Anonymous'}
            width={24}
            height={24}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="text-subtext flex h-full w-full items-center justify-center">
            <span className="material-symbols-rounded !text-sm">person</span>
          </div>
        )}
      </div>
      <span>{displayName || 'Anonymous'}</span>
    </Link>
  )
}
