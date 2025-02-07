import prisma from '@/utils/prisma'
import { generateSlug } from '@/utils/slugGenerator'
import { Votes, Prisma } from '@prisma/client'
import { Session } from 'next-auth'
import { NotFoundError } from '@/utils/errors'

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
  postTags?: Partial<UpsertPostTags>
}
export type UpdatePost = {
  id: number
  postTitle: string
  postContent: string
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

export const postRepository = {
  getPosts: async (args: GetPostBy) => {
    const posts = await prisma.posts.findMany({
      where: { ...args.where, isDeleted: false },
      orderBy: [...(args.orderBy || []), { createdAt: 'desc' }],
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
        category: true,
        postUpdate: true,
        postTags: true,
        createdUser: {
          include: {
            userInfo: true,
          },
        },
      },
    })
    return posts
  },

  getByCategory: async (args: GetByCategory) => {
    const posts = await postRepository.getPosts({
      where: { categoryId: args.categoryId },
      orderBy: [{ postUpdate: { updatedAt: 'desc' } }],
    })
    return posts
  },
  getRecentPosts: async () => {
    const posts = await postRepository.getPosts({
      orderBy: [{ createdAt: 'desc' }],
    })
    return posts
  },
  getRecentlyUpdatedPosts: async () => {
    const posts = await postRepository.getPosts({
      orderBy: [{ postUpdate: { updatedAt: 'desc' } }],
    })
    return posts
  },
  getPostsByKeyword: async (args: GetByKeyword) => {
    const keywords = args.keyword.filter((keyword) => !keyword.startsWith('#'))
    const tags = args.keyword
      .filter((keyword) => keyword.startsWith('#'))
      .map((tag) => tag.slice(1))
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
    })
    return posts
  },

  getBySlug: async (args: GetBySlug) => {
    const post = await prisma.posts.findUnique({
      where: {
        slug: args.slug,
        isDeleted: false,
      },
      include: {
        _count: {
          select: {
            comments: true,
            votes: {
              where: {
                vote: 1,
              },
            },
          },
        },
        category: true,
        postUpdate: true,
        postTags: true,
        createdUser: {
          include: {
            userInfo: true,
          },
        },
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
    const { postTags, ...rest } = args
    const post = await prisma.posts.update({
      where: { id: args.id },
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

// votes with negative downvotes
const getVoteCounts = (votes: Votes[]) => {
  const upvotes = votes.filter((vote) => vote.vote === 1).length
  const downvotes = votes.filter((vote) => vote.vote === -1).length
  return upvotes - downvotes
}
