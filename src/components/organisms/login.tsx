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
          className="w-full py-3 px-4 bg-gray-100 text-black cursor-pointer rounded-md flex items-center justify-center space-x-2 hover:bg-gray-200"
        >
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="block w-[30px] h-[30px]"
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            ></path>
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            ></path>
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            ></path>
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            ></path>
            <path fill="none" d="M0 0h48v48H0z"></path>
          </svg>
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  ) : (
    <div> You Are Already Logged In!</div>
  )
}
