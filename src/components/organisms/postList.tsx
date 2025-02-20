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
dayjs.extend(relativeTime)

type PostListProps = {
  posts?: PostType[]
  showCategory?: boolean
}

export const PostList = ({ posts, showCategory = false }: PostListProps) => {
  const { data: session } = useSession()

  if (!posts || posts.length === 0) {
    return <div className="text-color-subtext italic">No posts found</div>
  }

  return (
    <div>
      {posts.map((post: PostType) => (
        <div key={post.id} className="p-3 text-sm">
          {/* category  */}
          {showCategory && (
            <div className="flex items-center text-color-subtext mb-2 flex-wrap">
              {post.category.parentCategory && (
                <>
                  <Link
                    href={`/${post.category.parentCategory.slug}`}
                    className="hover:text-blue-800 dark:hover:text-blue-400"
                  >
                    {post.category.parentCategory.categoryName}
                  </Link>
                  <span className={`material-icons`}>
                    <div className="text-sm">chevron_right</div>
                  </span>
                </>
              )}
              <Link
                href={`/${post.category.slug}`}
                className="hover:text-blue-800 dark:hover:text-blue-400"
              >
                {post.category.categoryName}
              </Link>
            </div>
          )}
          {/* title  */}
          <Link href={`/${post.category.slug}/${post.slug}`}>
            <h3 className="text-xl font-semibold text-color-foreground hover:text-blue-600 dark:hover:text-blue-400">
              {post.postTitle}
            </h3>
          </Link>
          <div className="flex items-center text-sm text-color-subtext gap-2 flex-wrap">
            <span>
              <Button
                size="small"
                color="fade"
                boxStyle="box"
                leftIcon="person"
                label={`${
                  post.createdUser.userInfo?.displayName || 'Anonymous'
                }`}
              />
            </span>

            <Tooltip
              text={dayjs(post.createdAt).format('YYYY/MM/DD HH:mm')}
              width="115px"
              className="text-center"
            >
              <span>{fromNowShort(post.createdAt)}</span>
            </Tooltip>
          </div>

          {/* content  */}
          <p className="text-color-subtext line-clamp-2">
            {stripMarkdown(post.postContent)}
          </p>

          {/* info bar  */}

          <div className="flex items-center text-sm text-color-subtext mt-2 gap-2 flex-wrap">
            <Button
              rightIcon="chat"
              size="small"
              color="neutral"
              boxStyle="box"
              label={`${post._count.comments || 0}`}
              linkPath={`/${post.category.slug}/${post.slug}#comments`}
            />
            <VoteButtons
              postId={post.id}
              voteCount={post._count.votes || 0}
              canVote={Boolean(session)}
              userVotes={post.votes}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
