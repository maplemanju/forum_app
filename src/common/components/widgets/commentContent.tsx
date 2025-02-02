import { CommentType } from '@/types/comment'
import Tooltip from '../tooltip'
import { useEffect, useOptimistic, useState } from 'react'
import { CommentEdit } from './commentEdit'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

interface CommentContentProps {
  comment: Partial<CommentType>
  postId?: number | null
}

const CommentContent: React.FC<CommentContentProps> = ({ comment, postId }) => {
  const [openComments, setOpenComments] = useState<boolean>(false)
  const [openReply, setOpenReply] = useState<boolean>(false)
  const [childComments, setChildComments] = useState<
    Partial<CommentType & { isNewComment: boolean }>[]
  >(comment.childComments ?? [])

  useEffect(() => {
    setChildComments(comment.childComments ?? [])
  }, [comment])

  const [optimisticChildComments, addOptimisticChildComments] = useOptimistic(
    childComments,
    (currentState, optimisticValue: Partial<CommentType>) => {
      return [optimisticValue, ...currentState]
    }
  )

  const onVote = (commentId: number) => {
    console.log('vote', commentId, postId)
  }

  const onReply = (parentCommentId: number) => {
    console.log('reply', parentCommentId, postId)
    setOpenReply(!openReply)
    if (!openReply) {
      setOpenComments(true)
    }
  }

  const onEdit = (commentId: number) => {
    console.log('edit', commentId, postId)
  }

  const onDelete = (commentId: number) => {
    console.log('delete', commentId, postId)
  }

  const onOpenComments = () => {
    setOpenComments(!openComments)
    setOpenReply(false)
  }

  const replyCallback = (
    addedComment: Partial<CommentType>,
    isOptimistic: boolean
  ) => {
    setOpenComments(true)
    const newComment = { ...addedComment, isNewComment: true }
    if (isOptimistic) {
      addOptimisticChildComments(newComment)
    } else {
      setChildComments([newComment, ...childComments])
    }
  }

  const renderComments = (comment: Partial<CommentType>) => {
    return (
      <div className="space-y-2">
        <p className="text-gray-700">{comment.commentContent}</p>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>
            Posted by {comment.createdUser?.userInfo?.displayName ?? '-'}
          </span>
          <span>•</span>
          <Tooltip
            text={dayjs(comment.createdAt).format('YYYY/MM/DD HH:mm')}
            width="115px"
            className="text-center"
          >
            <span>{dayjs(comment.createdAt).fromNow()}</span>
          </Tooltip>
          <span>•</span>
          <span>{comment._count?.votes || 0} votes</span>
        </div>

        <div className="flex gap-2 pt-2">
          {optimisticChildComments.length > 0 &&
            comment.parentCommentId === null && (
              <button
                onClick={onOpenComments}
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                {openComments
                  ? 'Hide replies'
                  : `Show replies (${optimisticChildComments.length})`}
              </button>
            )}
          {onVote && (
            <button
              onClick={() => comment.id && onVote(comment.id)}
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              Vote
            </button>
          )}
          {onReply && comment.parentCommentId === null && (
            <button
              onClick={() => comment.id && onReply(comment.id)}
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              Reply
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => comment.id && onEdit(comment.id)}
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => comment.id && onDelete(comment.id)}
              className="text-sm text-gray-600 hover:text-red-600 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
        {openReply && comment.parentCommentId === null && (
          <CommentEdit
            setOpenAddComments={setOpenReply}
            postId={postId}
            parentCommentId={comment.id}
            submitCallback={replyCallback}
          />
        )}
      </div>
    )
  }

  return (
    <>
      {renderComments(comment)}
      {openComments && (
        <div className="space-y-2">
          {optimisticChildComments.map((childComment) => (
            <div
              key={
                childComment.id ||
                `optimistic-child-comment-${crypto.randomUUID()}`
              }
              className={`ml-4 p-4 ${
                childComment.isNewComment ? 'bg-yellow-100' : ''
              } transition-colors duration-400`}
            >
              {renderComments(childComment)}
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default CommentContent
