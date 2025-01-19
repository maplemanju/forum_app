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
    <div className="p-3">
      <button className="text-right" onClick={loginOrLogout}>
        {session ? 'Logout' : 'Login'}
      </button>
      <div>Content</div>
      <div>Footer</div>
      <Modal open={openLoginModal} onClose={() => setOpenLoginModal(false)}>
        <Login />
      </Modal>
    </div>
  )
}
