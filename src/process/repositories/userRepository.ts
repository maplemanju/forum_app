import { ROLES } from '@/utils/consts'
import prisma from '@/utils/prisma'
import generateRandomDisplayName from '@/utils/randomNameGenerator'
import { nanoid } from 'nanoid'

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
  userId: string
}
export type GetUserRolesProps = {
  userId: string
}
export type UpdateUserProfileProps = {
  userId?: string
  displayName?: string
  profileImage?: string
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
        publicId: args.userId,
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
    const user = await userRepository.getById(args)
    const userRoles = await prisma.userRoles.findMany({
      where: {
        userId: user.publicId,
        isDeleted: false,
      },
    })
    return userRoles.map((userRole: { roleId: number }) => userRole.roleId)
  },

  createUser: async (args: CreateUserProps) => {
    // create user
    const user = await prisma.users.create({
      data: { ...args, publicId: 'usr-' + nanoid(16) },
    })

    // create user info
    await prisma.userInfo.create({
      data: {
        userId: user.id,
        displayName: generateRandomDisplayName(),
      },
    })

    // create user role
    await userRepository.createUserRole(user.publicId, ROLES.USER)

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

  createUserRole: async (userId: string, roleId: number) => {
    return await prisma.userRoles.create({
      data: {
        userId,
        roleId,
      },
    })
  },

  updateUserProfile: async (args: UpdateUserProfileProps) => {
    if (!args.userId) {
      throw new Error('User ID is required')
    }
    const user = await userRepository.getById({ userId: args.userId })
    return await prisma.userInfo.update({
      where: { userId: user.id },
      data: {
        displayName: args.displayName,
        profileImage: args.profileImage,
      },
    })
  },
}

export default userRepository
