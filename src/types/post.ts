import type { Prisma } from '@prisma/client'

export type PostType = Prisma.PostsGetPayload<{
  include: {
    category: {
      include: {
        parentCategory: true
      }
    }
    postUpdate: true
    postTags: true
    createdUser: {
      include: {
        userInfo: true
      }
    }
    _count: {
      select: {
        comments: true
        votes: true
      }
    }
    votes: {
      // user session votes
      select: {
        vote: true
      }
    }
  }
}>

export type PostSingleType = Prisma.PostsGetPayload<{
  include: {
    category: {
      include: {
        parentCategory: true
      }
    }
    postUpdate: true
    postTags: true
    createdUser: {
      include: {
        userInfo: true
        _count: {
          select: {
            posts: true
            comments: true
            votes: true
          }
        }
      }
    }
    _count: {
      select: {
        comments: true
        votes: true
      }
    }
    votes: {
      // user session votes
      select: {
        vote: true
      }
    }
  }
}>
