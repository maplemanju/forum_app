'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/atoms/button'
import { useLoginPopup } from '@/hooks/useLoginPopup'
import Image from 'next/image'
import { getImagePath } from '@/utils/imageUtils'
import { config } from '@/utils/config'
import headerImage from '/public/images/logo-header.png'

export default function Header() {
  const { data: session } = useSession()
  const { openLoginPopup, isOpen: isLoginPopupOpen } = useLoginPopup()

  const loginOrLogout = () => {
    if (session) {
      signOut()
    } else if (!isLoginPopupOpen) {
      openLoginPopup()
    }
  }

  return (
    <div className="bg-background-secondary fixed top-0 left-0 z-9 w-full px-4 py-3">
      <div className="top-header flex items-center justify-between">
        {/** left */}
        <div>
          <Link href="/">
            <h1 className="pl-[44px] text-xl font-semibold md:pl-0">
              <Image
                src={headerImage}
                alt={config.siteName}
                width={200}
                className="absolute top-[5px] w-[170px] md:top-0 md:w-[200px] dark:invert-90"
              />
            </h1>
          </Link>
        </div>

        {/** right */}
        <div className="flex items-center gap-4">
          <Button
            color="neutral"
            size="small"
            rightIcon="search"
            linkPath="/search"
            boxStyle="box"
            title="Search"
            aria-label="Search"
          />
          {session && (
            <div
              className="h-[32px] w-[32px] overflow-hidden rounded-full text-gray-600 dark:text-white"
              aria-label="Go to your Profie"
            >
              <Link href={`/profile/${session.user?.id}`}>
                {session.user?.profileImage ? (
                  <Image
                    src={getImagePath(session.user?.profileImage)}
                    alt={session.user?.name || ''}
                    width={32}
                    height={32}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="material-symbols-rounded rounded-full bg-gray-200 px-1 py-1 text-gray-500">
                    person
                  </span>
                )}
              </Link>
            </div>
          )}
          <Button
            label={session ? '' : 'Login'}
            color={session ? 'gray' : 'primary'}
            size="small"
            onClick={loginOrLogout}
            leftIcon={session ? 'logout' : 'login'}
            title={session ? 'Logout' : 'Login'}
            aria-label={session ? 'Logout' : 'Login'}
          />
        </div>
      </div>
    </div>
  )
}
