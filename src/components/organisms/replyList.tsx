'use client'

import { CommentType } from '@/types/comment'
import { useOptimistic, useState } from 'react'
import CommentContent from './commentContent'
import CommentEdit from './commentEdit'

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

  const deleteCallback = (commentId: number) => {
    setRepliesState(repliesState.filter((reply) => reply.id !== commentId))
  }

  return (
    <>
      <div className="border-l-2 border-color-border px-2">
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
            className={`mt-2 ml-4 p-2 rounded-lg ${
              reply.isNewComment ? 'mt-2 bg-yellow-100 dark:bg-green-950' : ''
            } transition-colors duration-400`}
          >
            <CommentContent
              comment={reply}
              postId={parentPostId}
              deleteCallback={deleteCallback}
            />
          </div>
        ))}
      </div>
    </>
  )
}

export default ReplyList
