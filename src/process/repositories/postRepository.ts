import prisma from '@/utils/prisma'
import { generateSlug } from '@/utils/slugGenerator'
import { Prisma } from '@prisma/client'
import { getServerSession, Session } from 'next-auth'
import { NotFoundError } from '@/utils/errors'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export type GetByCategory = {
  categoryId: number
}
export type GetBySlug = {
  slug: string
}
export type CreatePost = {
  postTitle: string
  postContent: string
  categoryId: number
  heroImage?: string | null
  postTags?: Partial<UpsertPostTags>
}
export type UpdatePost = {
  id: number
  postTitle: string
  postContent: string
  heroImage?: string | null
  postTags?: Partial<UpsertPostTags>
}
export type DeletePostProps = {
  id: number
}
export type UpsertPostTags = {
  postId: number
  tags: string[]
}

type GetPostBy = {
  where?: Prisma.PostsWhereInput
  orderBy?: Prisma.PostsOrderByWithRelationInput[]
}

export type GetByKeyword = {
  keyword: string[]
}

export type PostStats = {
  take?: number
  skip?: number
  sort?: 'recent' | 'popular' | 'rated'
}

export const postRepository = {
  getPosts: async (args: GetPostBy & PostStats) => {
    const session = await getServerSession(authOptions)
    const posts = await prisma.posts.findMany({
      where: { ...args.where, isDeleted: false },
      orderBy: [...(args.orderBy || []), { createdAt: 'desc' }],
      take: args.take,
      skip: args.skip,
      include: {
        _count: {
          select: {
            comments: {
              where: {
                isDeleted: false,
              },
            },
            votes: {
              where: {
                vote: 1,
              },
            },
          },
        },

        category: {
          include: {
            parentCategory: true,
          },
        },
        postUpdate: true,
        postTags: true,
        createdUser: {
          include: {
            userInfo: true,
          },
        },
        votes: session
          ? {
              where: {
                userId: Number(session.user.id),
              },
              select: {
                vote: true,
              },
            }
          : undefined,
      },
    })
    return posts
  },

  getByCategory: async (args: GetByCategory & PostStats) => {
    let orderBy: Prisma.PostsOrderByWithRelationInput[] = [
      { postUpdate: { updatedAt: 'desc' } },
    ]
    if (args.sort === 'popular') {
      orderBy = [{ comments: { _count: 'desc' } }]
    } else if (args.sort === 'rated') {
      orderBy = [{ votes: { _count: 'desc' } }]
    }
    const posts = await postRepository.getPosts({
      where: { categoryId: args.categoryId },
      orderBy: orderBy,
      take: args.take,
      skip: args.skip,
    })
    return posts
  },
  getRecentPosts: async (args: PostStats) => {
    const posts = await postRepository.getPosts({
      orderBy: [{ createdAt: 'desc' }],
      take: args.take,
      skip: args.skip,
    })
    return posts
  },
  getRecentlyUpdatedPosts: async (args: PostStats) => {
    const posts = await postRepository.getPosts({
      orderBy: [{ postUpdate: { updatedAt: 'desc' } }],
      take: args.take,
      skip: args.skip,
    })
    return posts
  },
  getPostsByKeyword: async (args: GetByKeyword & PostStats) => {
    const keywords = args.keyword.filter((keyword) => !keyword.startsWith('#'))
    const tags = args.keyword
      .filter((keyword) => keyword.startsWith('#'))
      .map((tag) => tag.slice(1))
    let orderBy: Prisma.PostsOrderByWithRelationInput[] = []
    if (args.sort === 'recent') {
      orderBy = [{ postUpdate: { updatedAt: 'desc' } }]
    } else if (args.sort === 'popular') {
      orderBy = [{ comments: { _count: 'desc' } }]
    } else if (args.sort === 'rated') {
      orderBy = [{ votes: { _count: 'desc' } }]
    }
    const posts = await postRepository.getPosts({
      where: {
        OR: [
          ...keywords.map((keyword) => ({
            postTitle: {
              contains: keyword,
              mode: Prisma.QueryMode.insensitive,
            },
          })),
          ...keywords.map((keyword) => ({
            postContent: {
              contains: keyword,
              mode: Prisma.QueryMode.insensitive,
            },
          })),
          ...(tags.length > 0
            ? [
                {
                  postTags: {
                    tags: {
                      hasSome: tags,
                    },
                  },
                },
              ]
            : []),
        ],
      },
      take: args.take,
      skip: args.skip,
      orderBy: [...(orderBy || []), { createdAt: 'desc' }],
    })
    return posts
  },

  getBySlug: async (args: GetBySlug) => {
    const session = await getServerSession(authOptions)
    const post = await prisma.posts.findUnique({
      where: {
        slug: args.slug,
        isDeleted: false,
      },
      include: {
        _count: {
          select: {
            comments: {
              where: {
                isDeleted: false,
                parentCommentId: null,
              },
            },
            votes: {
              where: {
                vote: 1,
              },
            },
          },
        },
        category: {
          include: {
            parentCategory: true,
          },
        },
        postUpdate: true,
        postTags: true,
        createdUser: {
          include: {
            userInfo: true,
          },
        },
        votes: session
          ? {
              where: {
                userId: Number(session.user.id),
              },
              select: {
                vote: true,
              },
            }
          : undefined,
      },
    })
    if (!post) {
      throw new NotFoundError('Post not found')
    }
    return post
  },

  createPost: async (args: CreatePost, session: Session) => {
    const slug = generateSlug(args.postTitle)
    const { postTags, ...rest } = args
    const post = await prisma.posts.create({
      data: {
        ...rest,
        slug,
        createdBy: Number(session.user.id),
        updatedBy: Number(session.user.id),
      },
    })
    await postRepository.updatePostUpdate(post.id)
    if (postTags?.tags) {
      await postRepository.upsertPostTags({
        tags: postTags.tags,
        postId: post.id,
      })
    }
    return post
  },

  updatePost: async (args: UpdatePost, session: Session) => {
    const { postTags, id, ...rest } = args
    const post = await prisma.posts.update({
      where: { id },
      data: { ...rest, updatedBy: Number(session.user.id) },
    })
    if (postTags?.tags) {
      await postRepository.upsertPostTags({
        tags: postTags.tags,
        postId: post.id,
      })
    }
    return post
  },

  deletePost: async (args: DeletePostProps, session: Session) => {
    return await prisma.posts.update({
      where: { id: args.id },
      data: { isDeleted: true, updatedBy: Number(session.user.id) },
    })
  },

  updatePostUpdate: async (postId: number) => {
    return await prisma.postUpdates.upsert({
      where: { postId },
      update: { updatedAt: new Date() },
      create: { postId },
    })
  },

  upsertPostTags: async (args: UpsertPostTags) => {
    return await prisma.postTags.upsert({
      where: { postId: args.postId },
      update: { tags: args.tags },
      create: { postId: args.postId, tags: args.tags },
    })
  },
}

export default postRepository
