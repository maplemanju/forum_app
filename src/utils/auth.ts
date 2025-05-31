import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { getUserBySnsId, createUser } from '@/process/actions/userActions'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
        let userName = existingUser?.userInfo?.displayName
        let publicId = existingUser?.publicId
        let roles =
          existingUser?.userRoles.map(
            (role: { roleId: number }) => role.roleId
          ) || []
        const profileImage = existingUser?.userInfo?.profileImage
        if (!existingUser) {
          // Create a new user in the database if they don't exist
          const createdUser = await createUser({
            snsId: account.providerAccountId,
            email: user.email,
            authProvider: account.provider,
          })
          userName = createdUser?.userInfo?.displayName
          publicId = createdUser?.publicId

          // Get roles on initial login only for client side.
          // WARNING: do not rely on this to check user roles for any DB transactions. Always verify roles on the server side.
          roles =
            createdUser?.userRoles.map(
              (role: { roleId: number }) => role.roleId
            ) || []
        }

        // Attach user information to the JWT token
        token.name = userName
        token.userId = publicId
        token.roles = roles
        token.profileImage = profileImage
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        const userId = token.userId ? String(token.userId) : undefined
        session.user.name = String(token.name)
        session.user.id = userId
        session.user.roles = token.roles as number[]
        session.user.profileImage = token.profileImage as string | null
      }
      return session
    },
  },
}
