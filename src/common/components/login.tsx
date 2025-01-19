// components/Modal.js
import React from 'react'
import { signIn, useSession } from 'next-auth/react'

export default function Login() {
  const { data: session } = useSession()

  const handleSocialLogin = (provider: string) => {
    // Replace with actual login logic
    console.log(`Logging in with ${provider}`)
    signIn(provider)
  }

  return !session ? (
    <div>
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
