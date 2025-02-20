'use client'

import { PostType } from '@/types/post'
import Tooltip from '@/components/atoms/tooltip'
import { VoteButtons } from '@/components/molecules/voteButtons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Button } from '@/components/atoms/button'
import { useSession } from 'next-auth/react'
import { fromNowShort } from '@/utils/dateFormatter'
dayjs.extend(relativeTime)
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'

type PostProps = {
  post?: PostType
  mdxSource: MDXRemoteSerializeResult
}

export const PostContent = ({ post, mdxSource }: PostProps) => {
  const { data: session } = useSession()

  if (!post) {
    return <div>Post not found</div>
  }

  return (
    <div className=" p-6">
      {/* title  */}

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        {post.postTitle}
      </h1>

      {/* info bar  */}
      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2 gap-2">
        <div>
          <Button
            size="small"
            color="fade"
            boxStyle="box"
            leftIcon="person"
            label={`${post.createdUser.userInfo?.displayName}`}
          />
        </div>
        <Tooltip
          text={dayjs(post.createdAt).format('YYYY/MM/DD HH:mm')}
          width="115px"
          className="text-center"
        >
          <span>{fromNowShort(post.createdAt)}</span>
        </Tooltip>
        <Button
          rightIcon="chat"
          size="small"
          color="neutral"
          boxStyle="box"
          label={`${post._count.comments || 0}`}
          linkPath={`#comments`}
        />
        <VoteButtons
          postId={post.id}
          voteCount={post._count.votes || 0}
          canVote={Boolean(session)}
        />
      </div>

      {/* content  */}
      <div className="post-content mt-3">
        <MDXRemote {...mdxSource} />
      </div>

      {/* updated at  */}
      {!dayjs(post.updatedAt).isSame(dayjs(post.createdAt)) && (
        <div className="flex flex-column gap-2 mt-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="text-gray-600 dark:text-gray-400 mb-2">
            Updated at
          </div>
          <span>{dayjs(post.updatedAt).format('YYYY/MM/DD HH:mm')}</span>
        </div>
      )}

      {/* tags  */}
      {post.postTags?.tags && post.postTags?.tags.join('') && (
        <div className="flex flex-column gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400 items-center">
          <span className={`material-icons`}>label</span>
          <span>{post.postTags?.tags.join(', ')}</span>
        </div>
      )}
    </div>
  )
}
