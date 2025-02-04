'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

export default function Header() {
  const { data: session } = useSession()

  const loginOrLogout = () => {
    if (session) {
      signOut()
    } else {
      openLoginPopup()
    }
  }

  const openLoginPopup = () => {
    const width = 500
    const height = 600
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2

    window.open(
      '/login',
      '_blank',
      `width=${width},height=${height},left=${left},top=${top},popup=yes,resizable=no`
    )
  }

  return (
    <div className="w-full border-b border-gray-200 dark:border-gray-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/** left */}
        <div>
          <Link href="/">
            <h1 className="text-xl font-semibold">Forum App</h1>
          </Link>
        </div>

        {/** right */}
        <div className="flex items-center gap-4">
          <Link href="/search">Search</Link>
          {session && (
            <div className="text-gray-600 dark:text-white">
              Welcome, {session.user?.name}
            </div>
          )}
          <button
            className="px-4 py-2 rounded-md bg-blue-500 dark:bg-blue-400 hover:bg-blue-600 dark:hover:bg-blue-500 text-white transition-colors"
            onClick={loginOrLogout}
          >
            {session ? 'Logout' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  )
}
