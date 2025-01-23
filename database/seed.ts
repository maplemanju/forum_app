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

  await prisma.roles.createMany({
    data: [
      {
        id: 1,
        roleName: 'admin',
      },
      {
        id: 2,
        roleName: 'moderator',
        //TODO: add category
      },
      {
        id: 3,
        roleName: 'user',
      },
    ],
  })

  const mainCategory = await prisma.categories.create({
    data: {
      categoryName: 'General Discussion',
      categoryDescription: 'A place for general forum discussions',
      createdBy: 1,
      updatedBy: 1,
      childCategories: {
        create: [
          {
            categoryName: 'Introductions',
            categoryDescription: 'New members introduce yourself here',
            createdBy: 1,
            updatedBy: 1,
          },
          {
            categoryName: 'Announcements',
            categoryDescription: 'Important forum announcements',
            createdBy: 1,
            updatedBy: 1,
          },
        ],
      },
    },
  })

  // Seed posts
  const welcomePost = await prisma.posts.create({
    data: {
      categoryId: mainCategory.id,
      postTitle: 'Welcome to our Forum!',
      postContent: 'Welcome to our new forum. We hope you enjoy your stay!',
      createdBy: 1,
      updatedBy: 1,
    },
  })

  // Seed comments
  await prisma.comments.create({
    data: {
      postId: welcomePost.id,
      commentContent: 'Thanks for the warm welcome!',
      createdBy: 1,
      updatedBy: 1,
    },
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
