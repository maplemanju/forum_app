'use client'

import dayjs from 'dayjs'
import Image from 'next/image'
import Tooltip from '../atoms/tooltip'
import { config } from '@/utils/config'
import Link from 'next/link'

type UserInfoCardProps = {
  user?: {
    publicId: string
    userInfo?: {
      displayName: string
      createdAt: Date
      updatedAt: Date
      isDeleted: boolean
      userId: number
      score: number
      profileImage?: string | null
      // bio: string
    } | null
    createdAt: Date
    _count?: {
      posts: number
      comments: number
      receivedLikes: number
    }
  }
  fullWidth?: boolean
}

export const UserInfoCard = ({
  user,
  fullWidth = false,
}: UserInfoCardProps) => {
  return (
    <div
      role="group"
      aria-label="User information"
      className={`bg-accent-light flex h-full w-full flex-wrap items-center gap-4 rounded-md p-4 text-sm md:w-[200px] md:flex-col`}
      style={{ width: fullWidth ? '100%' : undefined }}
    >
      {/* Avatar */}
      <div className="bg-border-secondary h-16 w-16 overflow-hidden rounded-full">
        {user?.userInfo?.profileImage ? (
          <Image
            src={`${config.s3Path}${user?.userInfo?.profileImage || ''}`}
            alt={`${user?.userInfo?.displayName || 'User'}'s avatar`}
            width={64}
            height={64}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="text-subtext flex h-full w-full items-center justify-center"
            aria-hidden
          >
            <span className="material-symbols-rounded !text-4xl">person</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 md:items-center">
        {/* User Name */}
        <h3 className="text-foreground font-medium md:mb-1">
          <Link href={`/profile/${user?.publicId}`}>
            {user?.userInfo?.displayName || 'Unknown User'}
          </Link>
        </h3>

        {/* Join Date */}
        <time
          dateTime={user?.createdAt.toISOString()}
          className="text-subtext text-xs md:mb-2"
        >
          Joined {dayjs(user?.createdAt).format('MMM YYYY')}
        </time>

        {/* Stats */}
        <div className="text-subtext flex gap-4 text-xs">
          <div
            className="flex items-center gap-1 font-medium"
            aria-label={`${user?.userInfo?.displayName} has created a post ${user?._count?.receivedLikes || 0} times`}
          >
            <Tooltip text={`Post count`} width="115px" className="text-center">
              <span className="material-symbols-rounded !text-sm" aria-hidden>
                newsmode
              </span>
            </Tooltip>
            {user?._count?.posts || 0}
          </div>
          <div
            className="flex items-center gap-1 font-medium"
            aria-label={`${user?.userInfo?.displayName} has created a comment ${user?._count?.receivedLikes || 0} times`}
          >
            <Tooltip
              text={`Comment count`}
              width="115px"
              className="text-center"
            >
              <span className="material-symbols-rounded !text-sm" aria-hidden>
                chat
              </span>
            </Tooltip>
            {user?._count?.comments || 0}
          </div>
          <div
            className="flex items-center gap-1 font-medium"
            aria-label={`${user?.userInfo?.displayName} has recieved ${user?._count?.receivedLikes || 0} hearts`}
          >
            <Tooltip
              text={`Hearts received`}
              width="115px"
              className="text-center"
            >
              <span className="material-symbols-rounded !text-sm" aria-hidden>
                favorite
              </span>
            </Tooltip>
            {user?._count?.receivedLikes || 0}
          </div>
        </div>
      </div>
    </div>
  )
}
