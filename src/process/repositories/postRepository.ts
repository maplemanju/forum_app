import prisma from '@/utils/prisma'
import { generateSlug } from '@/utils/slugGenerator'
import { Votes, Prisma } from '@prisma/client'
import { Session } from 'next-auth'

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
}
export type UpdatePost = {
  id: number
  postTitle: string
  postContent: string
}
export type DeletePostProps = {
  id: number
}

type GetPostBy = {
  where?: Prisma.PostsWhereInput
  orderBy?: Prisma.PostsOrderByWithRelationInput[]
}

export const postRepository = {
  getPosts: async (args: GetPostBy) => {
    const posts = await prisma.posts.findMany({
      where: { ...args.where, OR: [{ isDeleted: false }, { isDeleted: null }] },
      orderBy: [...(args.orderBy || []), { createdAt: 'desc' }],
      include: {
        _count: {
          select: {
            comments: {
              where: {
                OR: [{ isDeleted: false }, { isDeleted: null }],
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

  getBySlug: async (args: GetBySlug) => {
    const post = await prisma.posts.findUnique({
      where: {
        slug: args.slug,
        OR: [{ isDeleted: false }, { isDeleted: null }],
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
        createdUser: {
          include: {
            userInfo: true,
          },
        },
      },
    })
    if (!post) return null
    return post
  },

  createPost: async (args: CreatePost, session: Session) => {
    const slug = generateSlug(args.postTitle)
    const post = await prisma.posts.create({
      data: {
        ...args,
        slug,
        createdBy: Number(session.user.id),
        updatedBy: Number(session.user.id),
      },
    })
    await postRepository.updatePostUpdate(post.id)
    return post
  },

  updatePost: async (args: UpdatePost, session: Session) => {
    const post = await prisma.posts.update({
      where: { id: args.id },
      data: { ...args, updatedBy: Number(session.user.id) },
    })
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
}

export default postRepository

// votes with negative downvotes
const getVoteCounts = (votes: Votes[]) => {
  const upvotes = votes.filter((vote) => vote.vote === 1).length
  const downvotes = votes.filter((vote) => vote.vote === -1).length
  return upvotes - downvotes
}
