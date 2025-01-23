'use client'

import Modal from '@/common/components/modal'
import Login from '@/common/components/login'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'

export default function Header() {
  const { data: session } = useSession()

  const [openLoginModal, setOpenLoginModal] = useState(false)

  const loginOrLogout = () => {
    if (session) {
      signOut()
    } else {
      setOpenLoginModal(true)
    }
  }

  return (
    <div className="w-full bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/** left */}
        <div>
          <h1 className="text-xl font-semibold">Forum App</h1>
        </div>

        {/** right */}
        <div className="flex items-center gap-4">
          {session && (
            <div className="text-gray-600">Welcome, {session.user?.name}</div>
          )}
          <button
            className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white transition-colors"
            onClick={loginOrLogout}
          >
            {session ? 'Logout' : 'Login'}
          </button>
        </div>
      </div>
      <Modal open={openLoginModal} onClose={() => setOpenLoginModal(false)}>
        <Login />
      </Modal>
    </div>
  )
}
