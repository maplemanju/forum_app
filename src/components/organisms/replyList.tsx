'use client'

import { ReplyType } from '@/types/comment'
import { useEffect, useOptimistic, useState } from 'react'
import CommentEdit from './commentEdit'
import ReplyContent from './replyContent'
import { useReplyLoadMore } from '@/hooks/useReplyLoadMore'
import { Button } from '@/components/atoms/button'

export const ReplyList = ({
  // replies: initialReplies,
  openReply,
  setOpenReply,
  parentPostId,
  parentCommentId,
  closeReplies,
  updateRepliesCount,
}: {
  // replies: Partial<CommentType>[]
  openReply: boolean
  setOpenReply: (openReply: boolean) => void
  parentPostId: number
  parentCommentId: number
  closeReplies: () => void
  updateRepliesCount: () => void
}) => {
  const { replies, isLoading, hasMore, handleLoadMore } = useReplyLoadMore({
    commentId: parentCommentId,
  })

  useEffect(() => {
    setRepliesState(replies)
  }, [replies])

  const [repliesState, setRepliesState] =
    useState<Partial<ReplyType & { isNewComment: boolean }>[]>(replies)

  const [optimisticReplies, addOptimisticReplies] = useOptimistic(
    repliesState,
    (
      currentState,
      optimisticValue: Partial<ReplyType & { isNewComment: boolean }>
    ) => {
      return [optimisticValue, ...currentState]
    }
  )

  const replyCallback = (
    addedComment: Partial<ReplyType>,
    isOptimistic: boolean
  ) => {
    const newComment = { ...addedComment, isNewComment: true }
    if (isOptimistic) {
      addOptimisticReplies(newComment)
    } else {
      setRepliesState([newComment, ...repliesState])
    }
    updateRepliesCount()
  }

  return (
    <>
      <div className="ml-1">
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
            className={`mt-2 p-2 ${
              reply.isNewComment ? 'mt-2 bg-highlight rounded-lg' : ''
            } transition-colors duration-400 border-b border-border-secondary last:border-b-0`}
          >
            <ReplyContent comment={reply} postId={parentPostId} />
          </div>
        ))}
        {optimisticReplies.length > 0 && (
          <div className="flex justify-center mt-2">
            <Button
              onClick={closeReplies}
              label="Hide replies"
              size="small"
              color="fade"
              boxStyle="box"
              leftIcon="expand_less"
            />
            <Button
              onClick={handleLoadMore}
              label="Load more"
              size="small"
              color="fade"
              boxStyle="box"
              leftIcon="expand_more"
              isLoading={isLoading}
              disabled={!hasMore}
            />
          </div>
        )}
      </div>
    </>
  )
}

export default ReplyList
