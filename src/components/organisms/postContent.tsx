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
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { MDXContent } from '@/components/templates/MDXContent'
import { mdxSerializer } from '@/utils/mdxSerializer'
import { useEffect, useState } from 'react'

type PostProps = {
  post?: PostType
}

export const PostContent = ({ post }: PostProps) => {
  const { data: session } = useSession()
  const [serializedContent, setSerializedContent] =
    useState<MDXRemoteSerializeResult | null>(null)

  useEffect(() => {
    const serializeContent = async () => {
      try {
        if (!post) {
          return
        }
        const mdxSource = await mdxSerializer(post.postContent ?? '')
        setSerializedContent(mdxSource)
      } catch (error) {
        console.error('Failed to serialize MDX:', error)
      }
    }

    serializeContent()
  }, [post])

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
        {serializedContent && <MDXContent source={serializedContent} />}
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
          <span className={`material-symbols-rounded`}>label</span>
          <span>{post.postTags?.tags.join(', ')}</span>
        </div>
      )}
    </div>
  )
}
