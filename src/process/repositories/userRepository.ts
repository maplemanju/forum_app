import prisma from '@/utils/prisma'
import generateRandomDisplayName from '@/utils/randomNameGenerator'

export type GetBySnsIdProps = {
  snsId: string
  authProvider: string
}
export type CreateUserProps = {
  snsId: string
  email: string
  authProvider: string
}
export const userRepository = {
  getBySnsId: async (args: GetBySnsIdProps) => {
    return await prisma.users.findUnique({
      where: {
        snsId: args.snsId,
        authProvider: args.authProvider,
      },
      include: {
        userInfo: true,
      },
    })
  },

  createUser: async (args: CreateUserProps) => {
    const user = await prisma.users.create({
      data: args,
    })
    const userInfo = await prisma.userInfo.create({
      data: {
        userId: user.id,
        displayName: generateRandomDisplayName(),
      },
    })
    return { ...user, userInfo }
  },
}

export default userRepository
