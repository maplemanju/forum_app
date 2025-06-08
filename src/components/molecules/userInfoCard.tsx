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
      className={`bg-accent-light flex h-full w-full flex-wrap items-center gap-4 rounded-md p-4 text-sm md:w-[200px] md:flex-col`}
      style={{ width: fullWidth ? '100%' : undefined }}
    >
      {/* Avatar */}
      <div className="bg-border-secondary h-16 w-16 overflow-hidden rounded-full">
        {user?.userInfo?.profileImage ? (
          <Image
            src={`${config.s3Path}${user?.userInfo?.profileImage || ''}`}
            alt={user?.userInfo?.displayName || 'User'}
            width={64}
            height={64}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="text-subtext flex h-full w-full items-center justify-center">
            <span className="material-symbols-rounded !text-4xl">person</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 md:items-center">
        {/* User Name */}
        <div className="text-foreground font-medium md:mb-1">
          <Link href={`/profile/${user?.publicId}`}>
            {user?.userInfo?.displayName || 'Unknown User'}
          </Link>
        </div>

        {/* Join Date */}
        <div className="text-subtext text-xs md:mb-2">
          Joined {dayjs(user?.createdAt).format('MMM YYYY')}
        </div>

        {/* Stats */}
        <div className="text-subtext flex gap-4 text-xs">
          <div>
            <div className="flex items-center gap-1 font-medium">
              <Tooltip
                text={`Post count`}
                width="115px"
                className="text-center"
              >
                <span className="material-symbols-rounded !text-sm">
                  newsmode
                </span>
              </Tooltip>
              {user?._count?.posts || 0}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1 font-medium">
              <Tooltip
                text={`Comment count`}
                width="115px"
                className="text-center"
              >
                <span className="material-symbols-rounded !text-sm">chat</span>
              </Tooltip>
              {user?._count?.comments || 0}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1 font-medium">
              <Tooltip
                text={`Hearts received`}
                width="115px"
                className="text-center"
              >
                <span className="material-symbols-rounded !text-sm">
                  favorite
                </span>
              </Tooltip>
              {user?._count?.receivedLikes || 0}
            </div>
          </div>
        </div>

        {/* Bio */}
        {/* {user?.userInfo?.bio && (
        <div className="mt-2 text-xs text-subtext text-center line-clamp-2">
          {user.userInfo.bio}
        </div>
      )} */}
      </div>
    </div>
  )
}
