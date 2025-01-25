import { CommentType } from '@/types/comment'
import Tooltip from '../tooltip'
import { useState } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

interface CommentContentProps {
  comment: CommentType
  postId?: number | null
}

const CommentContent: React.FC<CommentContentProps> = ({ comment, postId }) => {
  const [openComments, setOpenComments] = useState<boolean>(false)

  const onVote = (commentId: number) => {
    console.log('vote', commentId, postId)
  }

  const onReply = (parentCommentId: number) => {
    console.log('reply', parentCommentId, postId)
  }

  const onEdit = (commentId: number) => {
    console.log('edit', commentId, postId)
  }

  const onDelete = (commentId: number) => {
    console.log('delete', commentId, postId)
  }

  const renderComments = (comment: CommentType) => {
    return (
      <div className="space-y-2">
        <p className="text-gray-700">{comment.commentContent}</p>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Posted by {comment.createdUser.userInfo?.displayName}</span>
          <span>•</span>
          <Tooltip
            text={dayjs(comment.createdAt).format('YYYY/MM/DD HH:mm')}
            width="115px"
            className="text-center"
          >
            <span>{dayjs(comment.createdAt).fromNow()}</span>
          </Tooltip>
          <span>•</span>
          <span>{comment._count.votes || 0} votes</span>
        </div>

        <div className="flex gap-2 pt-2">
          {comment.childComments.length > 0 && (
            <button
              onClick={() => setOpenComments(!openComments)}
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              {openComments
                ? 'Hide replies'
                : `Show replies (${comment.childComments.length})`}
            </button>
          )}
          {onVote && (
            <button
              onClick={() => onVote(comment.id)}
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              Vote
            </button>
          )}
          {onReply && (
            <button
              onClick={() => onReply(comment.id)}
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              Reply
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(comment.id)}
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(comment.id)}
              className="text-sm text-gray-600 hover:text-red-600 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      {renderComments(comment)}
      {openComments && (
        <div className="space-y-2">
          {comment.childComments.map((childComment) => (
            <div key={childComment.id} className="ml-4 p-4">
              {renderComments(childComment)}
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default CommentContent
