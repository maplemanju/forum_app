'use client'

import { CommentType } from '@/types/comment'
import { useOptimistic, useState } from 'react'
import CommentContent from './commentContent'
import CommentEdit from './commentEdit'
import ReplyContent from './replyContent'

export const ReplyList = ({
  replies,
  openReply,
  setOpenReply,
  parentPostId,
  parentCommentId,
}: {
  replies: Partial<CommentType>[]
  openReply: boolean
  setOpenReply: (openReply: boolean) => void
  parentPostId: number
  parentCommentId: number
}) => {
  const [repliesState, setRepliesState] =
    useState<Partial<CommentType & { isNewComment: boolean }>[]>(replies)

  const [optimisticReplies, addOptimisticReplies] = useOptimistic(
    repliesState,
    (
      currentState,
      optimisticValue: Partial<CommentType & { isNewComment: boolean }>
    ) => {
      return [optimisticValue, ...currentState]
    }
  )

  const replyCallback = (
    addedComment: Partial<CommentType>,
    isOptimistic: boolean
  ) => {
    const newComment = { ...addedComment, isNewComment: true }
    if (isOptimistic) {
      addOptimisticReplies(newComment)
    } else {
      setRepliesState([newComment, ...repliesState])
    }
  }

  return (
    <>
      <div className="border-l border-color-border-secondary px-2 ml-4">
        {/* reply form */}
        {openReply && (
          <CommentEdit
            onCloseEdit={() => setOpenReply(false)}
            postId={parentPostId}
            parentCommentId={parentCommentId}
            submitCallback={replyCallback}
          />
        )}
        {optimisticReplies.map((reply) => (
          <div
            key={reply.id || `optimistic-child-comment-${crypto.randomUUID()}`}
            className={`mt-2 p-2 rounded-lg ${
              reply.isNewComment ? 'mt-2 bg-color-highlight' : ''
            } transition-colors duration-400`}
          >
            <ReplyContent comment={reply} postId={parentPostId} />
          </div>
        ))}
      </div>
    </>
  )
}

export default ReplyList
