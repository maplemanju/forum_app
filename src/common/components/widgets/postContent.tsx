import { PostType } from '@/types/post'
import Tooltip from '@/common/components/tooltip'
import { VoteButtons } from '@/common/components/voteButtons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

type PostProps = {
  post: PostType | null
}

export const PostContent = ({ post }: PostProps) => {
  if (!post) {
    return <div>Post not found</div>
  }

  return (
    <div className="bg-white p-6">
      {/* title  */}
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {post.postTitle}
      </h1>

      {/* info bar  */}
      <div className="flex items-center text-sm text-gray-500 mt-2 gap-2">
        <div>
          Posted by <span>{post.createdUser.userInfo?.displayName}</span>
        </div>
        <Tooltip
          text={dayjs(post.createdAt).format('YYYY/MM/DD HH:mm')}
          width="115px"
          className="text-center"
        >
          <span>{dayjs(post.createdAt).fromNow()}</span>
        </Tooltip>
        <span>•</span>
        <VoteButtons postId={post.id} voteCount={post._count.votes || 0} />
      </div>

      {/* content  */}
      <div className="text-gray-700 whitespace-pre-wrap mt-3">
        {post.postContent}
      </div>

      {/* updated at  */}
      {!dayjs(post.updatedAt).isSame(dayjs(post.createdAt)) && (
        <div className="flex flex-column gap-2 mt-4 text-sm text-gray-600">
          <div className="text-gray-600 mb-2">Updated at</div>
          <span>{dayjs(post.updatedAt).format('YYYY/MM/DD HH:mm')}</span>
        </div>
      )}
    </div>
  )
}
