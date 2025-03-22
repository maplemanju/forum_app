'use client'

import React, { useState, useEffect, useOptimistic } from 'react'
import CommentContent from '@/components/organisms/commentContent'
import { CommentType } from '@/types/comment'
import { CommentEdit } from './commentEdit'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/atoms/button'
import { useLoginPopup } from '@/hooks/useLoginPopup'

interface CommentsProps {
  comments?: CommentType[]
  postId?: number
}

const CommentList: React.FC<CommentsProps> = ({ comments = [], postId }) => {
  const { data: session } = useSession()
  const { openLoginPopup, isOpen: isLoginPopupOpen } = useLoginPopup()
  const [openAddComments, setOpenAddComments] = useState(false)
  const [commentsState, setCommentsState] =
    useState<Partial<CommentType & { isNewComment: boolean }>[]>(comments)

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
      </div>

      {openAddComments && (
        <CommentEdit
          onCloseEdit={() => setOpenAddComments(false)}
          postId={postId}
          submitCallback={submitCallback}
        />
      )}
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
    </div>
  )
}

export default CommentList
