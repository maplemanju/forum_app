import React from 'react'
import { Comments as CommentType } from '@prisma/client'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Tooltip from '@/common/components/tooltip'
dayjs.extend(relativeTime)

interface CommentsProps {
  comments: CommentType[]
  onVote?: (commentId: number) => void
  onReply?: (parentCommentId: number) => void
  onEdit?: (commentId: number, content: string) => void
  onDelete?: (commentId: number) => void
}

const Comments: React.FC<CommentsProps> = ({
  comments,
  onVote,
  onReply,
  onEdit,
  onDelete,
}) => {
  const renderComment = (comment: CommentType) => {
    return (
      <div key={comment.id} className="bg-white p-4 rounded-lg mb-3 shadow-sm">
        <div className="space-y-2">
          <p className="text-gray-700">{comment.commentContent}</p>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Posted by {comment.createdBy}</span>
            <span>•</span>
            <Tooltip
              text={dayjs(comment.createdAt).format('YYYY/MM/DD HH:mm')}
              width="115px"
              className="text-center"
            >
              <span>{dayjs(comment.createdAt).fromNow()}</span>
            </Tooltip>
          </div>

          <div className="flex gap-2 pt-2">
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
                onClick={() => onEdit(comment.id, comment.commentContent)}
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
      </div>
    )
  }

  return (
    <div className="space-y-4 mt-6">
      <h2 className="text-2xl font-bold text-gray-900">Comments</h2>
      {comments.map((comment) => renderComment(comment))}
    </div>
  )
}

export default Comments
