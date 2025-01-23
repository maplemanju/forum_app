import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import { getUserBySnsId, createUser } from '@/process/actions/userActions'

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
    strategy: 'jwt',
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
        if (!existingUser) {
          // Create a new user in the database if they don't exist
          const createdUser = await createUser({
            snsId: account.providerAccountId,
            email: user.email,
            authProvider: account.provider,
          })
          userName = createdUser?.userInfo?.displayName
        }

        // Attach user information to the JWT token
        token.name = userName
      }
      return token
    },
    async session({ session, token }) {
      console.log('session', session)
      if (session?.user) {
        session.user.name = String(token.name)
      }
      return session
    },
  },
})

export { handler as GET, handler as POST }
