import type { Prisma } from '@prisma/client'

export type User = Prisma.UsersGetPayload<{
  include: {
    userInfo: true
    userRoles: {
      select: {
        roleId: true
      }
    }
  }
}>
