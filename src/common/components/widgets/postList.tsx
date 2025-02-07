'use client'

import { PostType } from '@/types/post'
import Link from 'next/link'
import Tooltip from '@/common/components/tooltip'
import { VoteButtons } from '@/common/components/voteButtons'
import { useSession } from 'next-auth/react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

type PostListProps = {
  posts?: PostType[]
  showCategory?: boolean
}

export const PostList = ({ posts, showCategory = false }: PostListProps) => {
  const { data: session } = useSession()

  if (!posts || posts.length === 0) {
    return <div className="text-gray-500 italic">No posts found</div>
  }

  return (
    <div>
      {posts.map((post: PostType) => (
        <div
          key={post.id}
          className="p-6  border-b border-gray-200 dark:border-gray-800"
        >
          {/* category  */}
          {showCategory && (
            <Link
              href={`/${post.category.slug}`}
              className="text-sm text-gray-500 dark:text-gray-400 mb-2 hover:text-blue-800 dark:hover:text-blue-400"
            >
              {post.category.categoryName}
            </Link>
          )}
          {/* title  */}
          <Link href={`/${post.category.slug}/${post.slug}`}>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
              {post.postTitle}
            </h3>
          </Link>

          {/* info bar  */}
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2 gap-2">
            <span>
              Posted by {post.createdUser.userInfo?.displayName || 'Anonymous'}
            </span>
            <span>•</span>
            <Tooltip
              text={dayjs(post.createdAt).format('YYYY/MM/DD HH:mm')}
              width="115px"
              className="text-center"
            >
              <span>{dayjs(post.createdAt).fromNow()}</span>
            </Tooltip>
            <span>•</span>
            <span>{post._count.comments || 0} comments</span>
            <span>•</span>
            <VoteButtons
              postId={post.id}
              voteCount={post._count.votes || 0}
              canVote={Boolean(session)}
            />
            <span>•</span>
            {post.postUpdate && (
              <Tooltip
                text={dayjs(post.postUpdate?.updatedAt).format(
                  'YYYY/MM/DD HH:mm'
                )}
                width="115px"
                className="text-center"
              >
                <span>
                  updated at {dayjs(post.postUpdate?.updatedAt).fromNow()}
                </span>
              </Tooltip>
            )}
          </div>

          {/* content  */}
          <p className="text-gray-600 dark:text-gray-400 mt-3 line-clamp-3">
            {post.postContent}
          </p>
        </div>
      ))}
    </div>
  )
}
