'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/atoms/button'
import { useLoginPopup } from '@/hooks/useLoginPopup'
import Image from 'next/image'
import { getImagePath } from '@/utils/getImagePath'
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
    <div className="w-full bg-background-secondary px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/** left */}
        <div>
          <Link href="/">
            <h1 className="text-xl font-semibold">Forum App</h1>
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
          />
          {session && (
            <div className="text-gray-600 dark:text-white">
              <Link href={`/profile/${session.user?.id}`}>
                {session.user?.profileImage ? (
                  <Image
                    src={getImagePath(session.user?.profileImage || '')}
                    alt={session.user?.name || ''}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <span className="material-symbols-rounded rounded-full bg-gray-200 text-gray-500 py-1 px-1">
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
          />
        </div>
      </div>
    </div>
  )
}
