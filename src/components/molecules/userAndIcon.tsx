import Link from 'next/link'
import Image from 'next/image'
import { getImagePath } from '@/utils/getImagePath'

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
      className={`flex items-center gap-2 text-${size} text-foreground hover:opacity-80 transition-opacity`}
    >
      <div className="w-6 h-6 rounded-full overflow-hidden bg-border-secondary">
        {profileImage ? (
          <Image
            src={getImagePath(profileImage)}
            alt={displayName || 'Anonymous'}
            width={24}
            height={24}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-subtext">
            <span className="material-symbols-rounded !text-sm">person</span>
          </div>
        )}
      </div>
      <span>{displayName || 'Anonymous'}</span>
    </Link>
  )
}
