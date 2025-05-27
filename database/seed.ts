import { PrismaClient } from '@prisma/client'
import { nanoid } from 'nanoid'
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

  const admin = await prisma.users.create({
    data: {
      snsId: process.env.ADMIN_SNS_ID || '',
      authProvider: 'google',
      email: process.env.ADMIN_EMAIL || '',
      publicId: 'usr-' + nanoid(16),
    },
  })
  await prisma.userInfo.create({
    data: {
      userId: admin.id,
      displayName: 'Admin',
    },
  })
  await prisma.userRoles.create({
    data: {
      userId: admin.publicId,
      roleId: 1,
    },
  })

  const mainCategory = await prisma.categories.create({
    data: {
      categoryName: 'General Discussion',
      slug: 'general-discussion',
      categoryDescription: 'A place for general forum discussions',
      createdBy: admin.publicId,
      updatedBy: admin.publicId,
      childCategories: {
        create: [
          {
            categoryName: 'Introductions',
            slug: 'introductions',
            categoryDescription: 'New members introduce yourself here',
            createdBy: admin.publicId,
            updatedBy: admin.publicId,
          },
          {
            categoryName: 'Announcements',
            slug: 'announcements',
            categoryDescription: 'Important forum announcements',
            createdBy: admin.publicId,
            updatedBy: admin.publicId,
          },
        ],
      },
    },
  })

  // Seed posts
  const forumRulesPost = await prisma.posts.createManyAndReturn({
    data: [
      {
        categoryId: mainCategory.id,
        slug: 'welcome-to-our-forum',
        postTitle: 'Welcome to our Forum!',
        postContent: 'Welcome to our new forum. We hope you enjoy your stay!',
        createdBy: admin.publicId,
        updatedBy: admin.publicId,
        publishedAt: new Date(),
      },
      {
        categoryId: mainCategory.id,
        slug: 'forum-rules-and-guidelines',
        postTitle: 'Forum Rules and Guidelines',
        postContent:
          'Please read our community guidelines carefully. Be respectful to others and follow our posting rules.',
        createdBy: admin.publicId,
        updatedBy: admin.publicId,
        publishedAt: new Date(),
      },
      {
        categoryId: mainCategory.id,
        slug: 'how-to-format-your-posts',
        postTitle: 'How to Format Your Posts',
        postContent:
          'Learn how to use markdown formatting to make your posts more readable and engaging.',
        createdBy: admin.publicId,
        updatedBy: admin.publicId,
        publishedAt: new Date(),
      },
      {
        categoryId: mainCategory.id,
        slug: 'frequently-asked-questions',
        postTitle: 'Frequently Asked Questions',
        postContent:
          'Find answers to common questions about using the forum and your account settings.',
        createdBy: admin.publicId,
        updatedBy: admin.publicId,
        publishedAt: new Date(),
      },
      {
        categoryId: mainCategory.id,
        slug: 'share-your-feedback',
        postTitle: 'Share Your Feedback',
        postContent:
          'We value your input! Let us know what features you would like to see added to the forum.',
        createdBy: admin.publicId,
        updatedBy: admin.publicId,
        publishedAt: new Date(),
      },
    ],
  })

  // post updates
  Promise.all(
    forumRulesPost.map(async (post: (typeof forumRulesPost)[number]) => {
      await prisma.postUpdates.create({
        data: {
          postId: post.id,
        },
      })
    })
  )

  // Seed comments
  await prisma.comments.create({
    data: {
      postId: forumRulesPost[0].id,
      commentContent: 'Thanks for the warm welcome!',
      createdBy: admin.publicId,
      updatedBy: admin.publicId,
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
