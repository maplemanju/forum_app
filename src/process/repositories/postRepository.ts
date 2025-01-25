import prisma from '@/utils/prisma'
import { Votes } from '@prisma/client'

export type GetByCategory = {
  categoryId: number
}
export type GetById = {
  id: number
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

  getById: async (args: GetById) => {
    const post = await prisma.posts.findUnique({
      where: {
        id: args.id,
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
  return {
    votes: upvotes - downvotes,
  }
}
