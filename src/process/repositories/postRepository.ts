import prisma from '@/utils/prisma'
import { Votes } from '@prisma/client'

export type GetByCategory = {
  categoryId: number
}
export type GetBySlug = {
  slug: string
}
export const postRepository = {
  getByCategory: async (args: GetByCategory) => {
    const posts = await prisma.posts.findMany({
      where: {
        categoryId: args.categoryId,
      },
      include: {
        _count: {
          select: {
            comments: true,
          },
        },
        votes: true,
        category: true,
        createdUser: {
          include: {
            userInfo: true,
          },
        },
      },
    })

    const postsWithVotes = posts.map((post) => ({
      ...post,
      _count: {
        ...post._count,
        votes: getVoteCounts(post.votes),
      },
    }))

    return postsWithVotes
  },

  getBySlug: async (args: GetBySlug) => {
    const post = await prisma.posts.findUnique({
      where: {
        slug: args.slug,
      },
      include: {
        _count: {
          select: {
            comments: true,
          },
        },
        category: true,
        votes: true,
        createdUser: {
          include: {
            userInfo: true,
          },
        },
      },
    })
    if (!post) return null
    const voteCounts = getVoteCounts(post.votes)
    return { ...post, _count: { ...post._count, votes: voteCounts } }
  },
}

export default postRepository

const getVoteCounts = (votes: Votes[]) => {
  const upvotes = votes.filter((vote) => vote.vote === 1).length
  const downvotes = votes.filter((vote) => vote.vote === -1).length
  return upvotes - downvotes
}
