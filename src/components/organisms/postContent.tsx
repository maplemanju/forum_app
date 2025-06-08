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
import Image from 'next/image'
import { PostSkeleton } from '@/components/molecules/skeletons/postSkeleton'
import { UserInfoCard } from '../molecules/userInfoCard'
import { S3_PATH } from '@/utils/consts'
import { UserAndIcon } from '@/components/molecules/userAndIcon'

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
    <div className="bg-background-secondary rounded-lg p-6">
      {/* title  */}

      <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
        {post.postTitle}
      </h1>

      {/* info bar top  */}
      <div className="mt-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <div>
          <UserAndIcon
            displayName={post.createdUser.userInfo?.displayName || 'Anonymous'}
            publicId={post.createdUser.publicId}
            profileImage={post.createdUser.userInfo?.profileImage}
          />
        </div>
        <Tooltip
          text={`Posted at ${dayjs(post.publishedAt || post.createdAt).format(
            'YYYY/MM/DD HH:mm'
          )}`}
          width="115px"
          className="text-center"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-rounded !text-sm">today</span>
            <span>{fromNowShort(post.publishedAt || post.createdAt)}</span>
          </div>
        </Tooltip>
      </div>

      {/* content  */}
      {post.heroImage && (
        <div className="relative mx-auto my-4 max-w-4xl">
          <Image
            src={`${S3_PATH}${post.heroImage}`}
            alt={post.postTitle}
            width={0}
            height={0}
            sizes="100vw"
            className="h-auto w-full rounded-md"
          />
        </div>
      )}
      <div className="post-content mt-3">
        {serializedContent ? (
          <MDXContent source={serializedContent} />
        ) : (
          <PostSkeleton />
        )}
      </div>

      {/* info bar bottom  */}
      <div className="mt-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Tooltip
          text={`Posted at ${dayjs(post.publishedAt || post.createdAt).format(
            'YYYY/MM/DD HH:mm'
          )}`}
          width="115px"
          className="text-center"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-rounded !text-sm">today</span>
            <span>{fromNowShort(post.publishedAt || post.createdAt)}</span>
          </div>
        </Tooltip>
        {!dayjs(post.updatedAt).isSame(dayjs(post.createdAt)) && (
          <Tooltip
            text={`Edited at ${dayjs(post.updatedAt).format(
              'YYYY/MM/DD HH:mm'
            )}`}
            width="115px"
            className="text-center"
          >
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="material-symbols-rounded !text-sm">update</span>
              <span>{fromNowShort(post.updatedAt)}</span>
            </div>
          </Tooltip>
        )}
      </div>
      <div className="mt-4 flex items-center gap-2">
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
          userVotes={post.votes}
        />
      </div>

      {/* tags  */}
      {post.postTags?.tags && post.postTags?.tags.join('') && (
        <div className="flex-column mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span className={`material-symbols-rounded`}>label</span>
          <span>{post.postTags?.tags.join(', ')}</span>
        </div>
      )}

      {/* User Info - Full card for main comments */}
      <div className="mt-4">
        <UserInfoCard user={post.createdUser} fullWidth={true} />
      </div>
    </div>
  )
}
