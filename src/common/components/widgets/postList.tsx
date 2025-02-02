import { PostType } from '@/types/post'
import Link from 'next/link'
import Tooltip from '@/common/components/tooltip'
import { VoteButtons } from '@/common/components/voteButtons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

type PostListProps = {
  posts?: PostType[]
  categorySlug?: string
}

export const PostList = ({ posts, categorySlug }: PostListProps) => {
  if (!posts || posts.length === 0) {
    return <div className="text-gray-500 italic">No posts found</div>
  }

  return (
    <div>
      {posts.map((post: PostType) => (
        <div key={post.id} className="bg-white p-6  border-b border-gray-200">
          {/* title  */}
          <Link href={`/${categorySlug}/${post.slug}`}>
            <h3 className="text-xl font-semibold text-gray-800 hover:text-blue-600">
              {post.postTitle}
            </h3>
          </Link>

          {/* info bar  */}
          <div className="flex items-center text-sm text-gray-500 mt-2 gap-2">
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
            <VoteButtons postId={post.id} voteCount={post._count.votes || 0} />
          </div>

          {/* content  */}
          <p className="text-gray-600 mt-3 line-clamp-3">{post.postContent}</p>
        </div>
      ))}
    </div>
  )
}
