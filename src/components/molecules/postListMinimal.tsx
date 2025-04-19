'use client'

import { PostType } from '@/types/post'
import Link from 'next/link'
import Tooltip from '@/components/atoms/tooltip'
import { VoteButtons } from '@/components/molecules/voteButtons'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/atoms/button'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { stripMarkdown } from '@/utils/stripMarkdown'
import { fromNowShort } from '@/utils/dateFormatter'
import Image from 'next/image'
dayjs.extend(relativeTime)

type PostListProps = {
  posts?: PostType[]
  label?: string
}

export const PostListMinimal = ({ posts, label = 'Posts' }: PostListProps) => {
  const { data: session } = useSession()

  if (!posts || posts.length === 0) {
    return <div className="text-subtext italic">No posts found</div>
  }

  return (
    <>
      <h2 className="divider-label text-lg font-semibold">{label}</h2>
      <ul>
        {posts.map((post: PostType) => (
          <li
            key={post.id}
            className="p-2 text-sm border-b border-border-secondary last:border-b-0"
          >
            {/* category  */}
            <div className="text-subtext text-xs">
              {post.category.categoryName}
            </div>
            {/* title  */}
            <Link href={`/${post.category.slug}/${post.slug}`}>
              <div className="text-foreground hover:text-link">
                {post.postTitle}
              </div>
            </Link>
            <div className="flex items-center text-sm text-subtext gap-2 flex-wrap text-xs">
              <Button
                size="xsmall"
                color="fade"
                boxStyle="box"
                leftIcon="person"
                label={`${
                  post.createdUser.userInfo?.displayName || 'Anonymous'
                }`}
              />

              <Tooltip
                text={dayjs(post.publishedAt || post.createdAt).format(
                  'YYYY/MM/DD HH:mm'
                )}
                width="115px"
                className="text-center"
              >
                <span>{fromNowShort(post.publishedAt || post.createdAt)}</span>
              </Tooltip>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
