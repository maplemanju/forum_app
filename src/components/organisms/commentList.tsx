'use client'

import React, { useState, useEffect, useOptimistic } from 'react'
import CommentContent from '@/components/organisms/commentContent'
import { CommentType } from '@/types/comment'
import { CommentEdit } from './commentEdit'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/atoms/button'
import { useLoginPopup } from '@/hooks/useLoginPopup'
import { useCommentsPaging } from '@/hooks/useCommentsPaging'

interface CommentsProps {
  comments?: CommentType[]
  postId?: number
  commentCount: number
}

const CommentList: React.FC<CommentsProps> = ({
  comments,
  postId,
  commentCount,
}) => {
  const { data: session } = useSession()
  const { openLoginPopup, isOpen: isLoginPopupOpen } = useLoginPopup()
  const [openAddComments, setOpenAddComments] = useState(false)
  const [commentsState, setCommentsState] = useState<
    Partial<CommentType & { isNewComment: boolean }>[]
  >(comments ?? [])

  const { hasMoreOld, hasMoreNew, handleLoadMore } = useCommentsPaging({
    commentCount: commentCount,
  })

  useEffect(() => {
    setCommentsState(comments ?? [])
  }, [comments])

  const [optimisticComments, addOptimisticComments] = useOptimistic(
    commentsState,
    (
      currentState,
      optimisticValue: Partial<CommentType & { isNewComment: boolean }>
    ) => {
      return [optimisticValue, ...currentState]
    }
  )

  const submitCallback = (
    comment: Partial<CommentType>,
    isOptimistic: boolean
  ) => {
    const newComment = { ...comment, isNewComment: true }
    if (isOptimistic) {
      addOptimisticComments(newComment)
    } else {
      setCommentsState([newComment, ...commentsState])
    }
  }

  return (
    <div id="comments" className="mt-6">
      <div className="p-4 mb-4">
        <Button
          onClick={() => {
            if (session) {
              setOpenAddComments(!openAddComments)
            } else if (!isLoginPopupOpen) {
              openLoginPopup()
            }
          }}
          label="Add Comment"
          color="primary"
          leftIcon="chat"
        />
        {openAddComments && (
          <CommentEdit
            onCloseEdit={() => setOpenAddComments(false)}
            postId={postId}
            submitCallback={submitCallback}
          />
        )}
      </div>
      {optimisticComments.length === 0 ? (
        <div className="p-4 text-color-subtext">No comments yet</div>
      ) : (
        optimisticComments.map((comment) => {
          return (
            <div
              key={comment.id || `optimistic-comment-${crypto.randomUUID()}`}
              className={`p-4 shadow-sm transition-colors duration-300 border-b border-color-border-secondary ${
                comment.isNewComment ? 'bg-color-highlight' : ''
              }`}
            >
              <CommentContent comment={comment} postId={postId} />
            </div>
          )
        })
      )}

      <div className="flex items-center justify-between gap-4 mt-4">
        {/* Jump to Oldest + Previous */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => handleLoadMore('oldest')}
            color="fade"
            leftIcon="first_page"
            disabled={!hasMoreOld}
            aria-label="Jump to oldest comments"
            // className="!p-2"
          />
          <Button
            onClick={() => handleLoadMore('previous')}
            label="Previous"
            color="fade"
            leftIcon="arrow_back_ios"
            disabled={!hasMoreOld}
          />
        </div>

        {/* Next + Jump to Latest */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => handleLoadMore('next')}
            label="Next"
            color="fade"
            rightIcon="arrow_forward_ios"
            disabled={!hasMoreNew}
          />
          <Button
            onClick={() => handleLoadMore('latest')}
            color="fade"
            rightIcon="last_page"
            disabled={!hasMoreNew}
            aria-label="Jump to latest comments"
            // className="!p-2"
          />
        </div>
      </div>
    </div>
  )
}

export default CommentList
