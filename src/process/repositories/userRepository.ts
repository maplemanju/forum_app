import { ROLES } from '@/utils/consts'
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
export type GetByIdProps = {
  id: number
}
export type GetUserRolesProps = {
  userId: number
}
export const userRepository = {
  getBySnsId: async (args: GetBySnsIdProps) => {
    return await prisma.users.findUnique({
      where: {
        snsId: args.snsId,
        authProvider: args.authProvider,
        isDeleted: false,
      },
      include: {
        userInfo: true,
        userRoles: {
          select: {
            roleId: true,
          },
        },
      },
    })
  },

  getById: async (args: GetByIdProps) => {
    return await prisma.users.findUniqueOrThrow({
      where: {
        id: args.id,
        isDeleted: false,
      },
      include: {
        userInfo: true,
        userRoles: {
          select: {
            roleId: true,
          },
        },
      },
    })
  },

  getUserRoles: async (args: GetUserRolesProps) => {
    const userRoles = await prisma.userRoles.findMany({
      where: {
        userId: args.userId,
        isDeleted: false,
      },
    })
    return userRoles.map((userRole) => userRole.roleId)
  },

  createUser: async (args: CreateUserProps) => {
    // create user
    const user = await prisma.users.create({
      data: args,
    })

    // create user info
    await prisma.userInfo.create({
      data: {
        userId: user.id,
        displayName: generateRandomDisplayName(),
      },
    })

    // create user role
    await userRepository.createUserRole(user.id, ROLES.USER)

    // get user info
    const userInfo = await prisma.users.findUnique({
      where: {
        id: user.id,
      },
      include: {
        userInfo: true,
        userRoles: {
          select: {
            roleId: true,
          },
        },
      },
    })
    return userInfo
  },

  createUserRole: async (userId: number, roleId: number) => {
    return await prisma.userRoles.create({
      data: {
        userId,
        roleId,
      },
    })
  },
}

export default userRepository
