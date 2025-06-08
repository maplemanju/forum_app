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
import { useInfinitePostScroll } from '@/hooks/useInfinitePostScroll'
import { useRef } from 'react'
import { SortSelect } from '@/components/molecules/sortSelect'
import { useRouter, useSearchParams } from 'next/navigation'
import { config } from '@/utils/config'
import { UserAndIcon } from '@/components/molecules/userAndIcon'
dayjs.extend(relativeTime)

type PostListProps = {
  initialPosts?: PostType[]
  showCategory?: boolean
  label?: string
  showSort?: boolean

  // for infinity scroll fetch
  typeOfList?: 'recent' | 'category' | 'keyword'
  categoryId?: number | null
  keywords?: string[] | null
  sort?: 'recent' | 'popular' | 'rated'
}

export const PostList = ({
  initialPosts,
  showCategory = false,
  label = 'Posts',
  typeOfList = 'recent',
  categoryId,
  keywords,
  showSort,
}: PostListProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const observerTarget = useRef<HTMLDivElement>(null)
  const { posts, isLoading } = useInfinitePostScroll({
    initialPosts: initialPosts || [],
    observerTarget: observerTarget,
    typeOfList: typeOfList,
    categoryId: categoryId,
    keywords: keywords,
  })

  if (!posts || posts.length === 0) {
    return <div className="text-subtext px-4 italic">No posts found</div>
  }

  const sortChangeHandler = (value: string) => {
    const current = new URLSearchParams(searchParams)
    current.set('sort', value)
    router.push(`?${current.toString()}`)
  }

  return (
    <>
      <div className="divider-label flex items-center justify-between">
        <h2 className="text-lg font-semibold">{label}</h2>
        {showSort && <SortSelect onChange={sortChangeHandler} />}
      </div>
      <div>
        {posts.map((post: PostType, index: number) => (
          <div
            key={`feed-${index}`}
            className="border-border-secondary border-b px-4 py-8 text-sm first:pt-2 last:border-b-0"
          >
            {/* category  */}
            {showCategory && (
              <div className="text-subtext mb-2 flex flex-wrap items-center">
                {post.category.parentCategory && (
                  <>
                    <Link
                      href={`/${post.category.parentCategory.slug}`}
                      className="hover:text-link"
                    >
                      {post.category.parentCategory.categoryName}
                    </Link>
                    <span className={`material-symbols-rounded`}>
                      <div className="text-sm">chevron_right</div>
                    </span>
                  </>
                )}
                <Link
                  href={`/${post.category.slug}`}
                  className="hover:text-link"
                >
                  {post.category.categoryName}
                </Link>
              </div>
            )}
            {/* title  */}
            <Link href={`/${post.category.slug}/${post.slug}`}>
              <h3 className="text-foreground hover:text-link mb-1 text-xl font-semibold">
                {post.postTitle}
              </h3>
            </Link>
            <div className="text-subtext mb-1 flex flex-wrap items-center gap-2 text-sm">
              <span>
                <UserAndIcon
                  displayName={
                    post.createdUser.userInfo?.displayName || 'Anonymous'
                  }
                  publicId={post.createdUser.publicId}
                  profileImage={post.createdUser.userInfo?.profileImage}
                />
              </span>

              <Tooltip
                text={`Posted at ${dayjs(
                  post.publishedAt || post.createdAt
                ).format('YYYY/MM/DD HH:mm')}`}
                width="115px"
                className="text-center"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-rounded !text-sm">
                    today
                  </span>
                  <span>
                    {fromNowShort(post.publishedAt || post.createdAt)}
                  </span>
                </div>
              </Tooltip>
            </div>

            {/* hero image  */}
            {post.heroImage && (
              <div className="relative mx-auto my-4 max-w-4xl">
                <Link href={`/${post.category.slug}/${post.slug}`}>
                  <Image
                    src={`${config.s3Path}${post.heroImage}`}
                    alt={post.postTitle}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="h-[150px] w-full rounded-md object-cover object-center sm:h-[300px]"
                  />
                </Link>
              </div>
            )}

            {/* content  */}
            <p className="line-clamp-2">{stripMarkdown(post.postContent)}</p>

            {/* info bar  */}

            <div className="text-subtext mt-2 flex flex-wrap items-center gap-2 text-sm">
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

        {/* Loading trigger */}
        <div
          ref={observerTarget}
          className="flex h-[80px] items-center justify-center"
        >
          {isLoading && (
            <div className="text-subtext flex items-center gap-2">
              <div className="border-subtext h-5 w-5 animate-spin rounded-full border-2 border-t-transparent"></div>
              <span>Loading more posts</span>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
