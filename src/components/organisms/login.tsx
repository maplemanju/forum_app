'use client'

import React, { useEffect, useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function Login() {
  const { data: session } = useSession()
  const [isPopupWindow, setIsPopupWindow] = useState(false)

  useEffect(() => {
    // Check if window has an opener and is not the same window
    const isPopup = window?.opener !== null && window?.opener !== window
    setIsPopupWindow(isPopup)

    // dont allow to access this page directly
    if (!isPopup) {
      redirect('/')
    }
  }, [])

  useEffect(() => {
    // close popup window if user is logged in
    if (session && isPopupWindow) {
      window.opener?.postMessage('login_complete', window.location.origin)
      window.close()
    } else if (session) {
      redirect('/')
    }
  }, [session, isPopupWindow])

  const handleSocialLogin = (provider: string) => {
    // Replace with actual login logic
    console.log(`Logging in with ${provider}`)
    signIn(provider)
  }

  return !session ? (
    <div className="p-4 min-w-[300px] max-w-[500px] w-full mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-6">Sign In</h2>

      {/* SNS Login Buttons */}
      <div className="space-y-4">
        <button
          onClick={() => handleSocialLogin('google')}
          className="w-full py-3 px-4 bg-red-500 text-white rounded-md flex items-center justify-center space-x-2 hover:bg-red-600"
        >
          <span>Login with Google</span>
        </button>

        <button
          onClick={() => handleSocialLogin('facebook')}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-md flex items-center justify-center space-x-2 hover:bg-blue-700"
        >
          <span>Login with Facebook</span>
        </button>
      </div>
    </div>
  ) : (
    <div> You Are Already Logged In!</div>
  )
}
