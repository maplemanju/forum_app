import dayjs from 'dayjs'
import Image from 'next/image'
import Tooltip from '../atoms/tooltip'

type UserInfoCardProps = {
  user?: {
    userInfo?: {
      displayName: string
      createdAt: Date
      updatedAt: Date
      isDeleted: boolean
      userId: number
      score: number
      // avatar: string
      // bio: string
    } | null
    createdAt: Date
    _count?: {
      posts: number
      comments: number
      receivedLikes: number
    }
  }
}

export const UserInfoCard = ({ user }: UserInfoCardProps) => {
  return (
    <div
      className={`flex items-center gap-4 p-4 w-full h-full text-sm flex-wrap bg-color-accent-light rounded-md
    md:flex-col md:w-[200px]`}
    >
      {/* Avatar */}
      <div className="w-16 h-16 rounded-full bg-color-border-secondary overflow-hidden">
        {/* <Image
          src={user.userInfo.avatar}
          alt={user.userInfo?.displayName || 'User'}
          width={64}
          height={64}
          className="w-full h-full object-cover"
        /> */}
        <span className="material-symbols-rounded text-4xl w-full h-full flex items-center justify-center text-color-subtext">
          person
        </span>
      </div>

      <div className="flex flex-col md:items-center gap-1">
        {/* User Name */}
        <div className="font-medium text-color-foreground md:mb-1">
          {user?.userInfo?.displayName || 'Unknown User'}
        </div>

        {/* Join Date */}
        <div className="text-xs text-color-subtext md:mb-2">
          Joined {dayjs(user?.createdAt).format('MMM YYYY')}
        </div>

        {/* Stats */}
        <div className="flex gap-4 text-xs text-color-subtext">
          <div>
            <div className="font-mediu   flex items-center gap-1">
              <Tooltip
                text={`Post count`}
                width="115px"
                className="text-center"
              >
                <span className="material-symbols-rounded text-sm">
                  newsmode
                </span>
              </Tooltip>
              {user?._count?.posts || 0}
            </div>
          </div>
          <div>
            <div className="font-medium flex items-center gap-1">
              <Tooltip
                text={`Comment count`}
                width="115px"
                className="text-center"
              >
                <span className="material-symbols-rounded text-sm">chat</span>
              </Tooltip>
              {user?._count?.comments || 0}
            </div>
          </div>
          <div>
            <div className="font-medium flex items-center gap-1">
              <Tooltip
                text={`Likes received`}
                width="115px"
                className="text-center"
              >
                <span className="material-symbols-rounded text-sm">
                  favorite
                </span>
              </Tooltip>
              {user?._count?.receivedLikes || 0}
            </div>
          </div>
        </div>

        {/* Bio */}
        {/* {user?.userInfo?.bio && (
        <div className="mt-2 text-xs text-color-subtext text-center line-clamp-2">
          {user.userInfo.bio}
        </div>
      )} */}
      </div>
    </div>
  )
}
