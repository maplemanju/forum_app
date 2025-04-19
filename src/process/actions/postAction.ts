'use server'

import { getServerSession } from 'next-auth'
import postRepository, {
  GetBySlug,
  CreatePost,
  UpdatePost,
  DeletePostProps,
} from '../repositories/postRepository'
import { PostType } from '@/types/post'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { ResponseType, ApplicationError, NotFoundError } from '@/utils/errors'
import { sanitizeContent } from '@/utils/domPurifier'
import { getUserById } from './userActions'
import { ROLES } from '@/utils/consts'
/**
 * Get the most recent posts.
 * Sorted by publishedAt in descending order.
 * @returns The most recent posts
 */
export const getRecentPosts = async ({
  take = Number(process.env.NEXT_PUBLIC_SIDEBAR_NEW_POST_COUNT),
  skip = 0,
}: {
  take?: number
  skip?: number
}): Promise<ResponseType<PostType[]>> => {
  try {
    const response = await postRepository.getRecentPosts({ take, skip })
    console.log('getRecentPosts')
    return {
      data: response,
      success: true,
    }
  } catch (err) {
    const error = err as Error
    console.error('Error getting recent posts:', error?.message)
    throw new ApplicationError('Error getting recent posts')
  }
}

/**
 * Get the most recently updated posts.
 * Sorted by comment date in descending order.
 * @returns The most recently updated posts
 */
export const getRecentlyUpdatedPosts = async ({
  take = Number(process.env.NEXT_PUBLIC_POST_LIST_PER_PAGE),
  skip = 0,
}: {
  take?: number
  skip?: number
}): Promise<ResponseType<PostType[]>> => {
  try {
    const response = await postRepository.getRecentlyUpdatedPosts({
      take,
      skip,
    })
    console.log('getRecentlyUpdatedPosts')
    return {
      data: response,
      success: true,
    }
  } catch (err) {
    const error = err as Error
    console.error('Error getting recently updated posts:', error?.message)
    throw new ApplicationError('Error getting recently updated posts')
  }
}

/**
 * Get posts by category.
 * Sorted by comment date in descending order.
 * @param args.categoryId The category id
 * @returns The posts
 */
export const getPostsByCategory = async ({
  take = Number(process.env.NEXT_PUBLIC_POST_LIST_PER_PAGE),
  skip = 0,
  categoryId,
  sort,
}: {
  take?: number
  skip?: number
  categoryId: number
  sort?: 'recent' | 'popular' | 'rated'
}): Promise<ResponseType<PostType[]>> => {
  try {
    const response = await postRepository.getByCategory({
      take,
      skip,
      categoryId,
      sort,
    })
    console.log('getPostsByCategory')
    return {
      data: response,
      success: true,
    }
  } catch (err) {
    const error = err as Error
    console.error('Error getting posts by category:', error?.message)
    throw new ApplicationError('Error getting posts by category')
  }
}

/**
 * Get posts by keywords.
 * @param args.keyword The keywords
 * @returns The posts
 */
export const getPostsByKeyword = async ({
  take = Number(process.env.NEXT_PUBLIC_POST_LIST_PER_PAGE),
  skip = 0,
  keyword,
  sort,
}: {
  take?: number
  skip?: number
  keyword: string[]
  sort?: 'recent' | 'popular' | 'rated'
}): Promise<ResponseType<PostType[]>> => {
  try {
    const response = await postRepository.getPostsByKeyword({
      take,
      skip,
      keyword,
      sort,
    })
    console.log('getPostsByKeyword')
    return {
      data: response,
      success: true,
    }
  } catch (err) {
    const error = err as Error
    console.error('Error getting posts by keyword:', error?.message)
    throw new ApplicationError('Error getting posts by keyword')
  }
}

/**
 * Get post by slug.
 * @param args.slug The slug
 * @returns The post
 */
export const getPostBySlug = async (
  args: GetBySlug
): Promise<ResponseType<PostType>> => {
  try {
    const response = await postRepository.getBySlug(args)
    console.log('getPostBySlug')
    return {
      data: response,
      success: true,
    }
  } catch (err) {
    const error = err as Error
    console.error('Error getting post by slug:', error?.message)
    if (error instanceof NotFoundError) {
      return {
        success: false,
        message: 'Post not found',
        type: 'error',
      }
    } else {
      throw new ApplicationError('Error getting post by slug')
    }
  }
}

export type UpdatePostResponse = ResponseType<Partial<PostType>>

export const createPost = async (
  args: CreatePost
): Promise<UpdatePostResponse> => {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  try {
    // verify
    await getUserById({ id: session.user.id })

    const sanitizedContent = sanitizeContent(args.postContent)
    const response = await postRepository.createPost(
      { ...args, postContent: sanitizedContent },
      session
    )
    console.log('createPost')
    return {
      data: response,
      success: true,
    }
  } catch (err) {
    const error = err as Error
    console.error('Error creating post', error?.message)
    return {
      success: false,
      message: 'Error creating post',
      type: 'error',
    }
  }
}

export const updatePost = async (
  args: UpdatePost
): Promise<UpdatePostResponse> => {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  try {
    // verify
    const user = await getUserById({ id: session.user.id })
    const existingPost = await postRepository.getById({ id: args.id })
    const isOwner = user.id === existingPost.createdBy
    const isAdmin = user.userRoles.some((role) => role.roleId === ROLES.ADMIN)
    if (!isOwner && !isAdmin) {
      throw new Error('Unauthorized')
    }
    const sanitizedContent = sanitizeContent(args.postContent)
    const response = await postRepository.updatePost(
      { ...args, postContent: sanitizedContent },
      session
    )
    console.log('updatePost')
    return {
      data: response,
      success: true,
    }
  } catch (err) {
    const error = err as Error
    console.error('Error updating post', error?.message)
    return {
      success: false,
      message: 'Error updating post',
      type: 'error',
    }
  }
}

export const deletePost = async (
  args: DeletePostProps
): Promise<ResponseType<null>> => {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  try {
    // verify
    const user = await getUserById({ id: session.user.id })
    const existingPost = await postRepository.getById({ id: args.id })
    const isOwner = user.id === existingPost.createdBy
    const isAdmin = user.userRoles.some((role) => role.roleId === ROLES.ADMIN)
    if (!isOwner && !isAdmin) {
      throw new Error('Unauthorized')
    }

    await postRepository.deletePost(args, session)
    console.log('deletePost')
    return {
      success: true,
    }
  } catch (err) {
    const error = err as Error
    console.error('Error deleting post', error?.message)
    return {
      success: false,
      message: 'Error deleting post',
      type: 'error',
    }
  }
}
