import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import { NextResponse } from 'next/server'

export const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt', // You can also use 'database' if you prefer a database session strategy
  },
  callbacks: {
    async jwt({ token, account, user }) {
      return token // Always return the token
    },
    async session({ session, token }) {
      return session // Always return the session
    },
  },
})

export { handler as GET, handler as POST }
