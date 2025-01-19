import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.users.createMany({
    data: [
      {
        id: 1,
        snsId: 'test',
        authProvider:'test',
        email:'test@',
      },
    ],
  })

  await prisma.userInfo.createMany({
    data: [
      {
        userId: 1,
        displayName:'testuser'
      },
    ],
  })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
