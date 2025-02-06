import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import { getUserBySnsId, createUser } from '@/process/actions/userActions'

export const authOptions: NextAuthOptions = {
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
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 1 day
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user && user.email) {
        // On the first login (when `account` and `user` are defined)
        const existingUser = await getUserBySnsId({
          snsId: account.providerAccountId,
          authProvider: account.provider,
        })
        let userName = existingUser?.userInfo?.displayName || '-'
        let userId = existingUser?.id || null
        if (!existingUser) {
          // Create a new user in the database if they don't exist
          const createdUser = await createUser({
            snsId: account.providerAccountId,
            email: user.email,
            authProvider: account.provider,
          })
          userName = createdUser?.userInfo?.displayName
          userId = createdUser?.id
        }

        // Attach user information to the JWT token
        token.name = userName
        token.userId = userId
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.name = String(token.name)
        session.user.id = String(token.userId)
      }
      return session
    },
  },
}

export const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
