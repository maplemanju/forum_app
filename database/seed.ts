import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // add init site settings
  const initSettings = [
    { settingName: 'forum_name', value: 'Forum App' },
    { settingName: 'max_category_level', value: '1' },
    { settingName: 'allow_md_comment', value: '1' },
  ]
  await prisma.$transaction(async () => {
    for (const settings of initSettings) {
      await prisma.settings.upsert({
        where: {
          settingName: settings.settingName,
        },
        create: settings,
        update: settings,
      })
    }
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
