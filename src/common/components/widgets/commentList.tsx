'use client'

import React, { useState, useEffect, useOptimistic } from 'react'
import CommentContent from '@/common/components/widgets/commentContent'
import { CommentType } from '@/types/comment'
import { CommentEdit } from './commentEdit'
import { useSession } from 'next-auth/react'
import { Button } from '@/common/components/button'
interface CommentsProps {
  comments?: CommentType[]
  postId?: number
}

const CommentList: React.FC<CommentsProps> = ({ comments = [], postId }) => {
  const { data: session } = useSession()
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

  const deleteCallback = (commentId: number) => {
    setCommentsState(
      commentsState.filter((comment) => comment.id !== commentId)
    )
  }

  return (
    <div id="comments" className="space-y-4 mt-6">
      <div className="mb-4">
        <Button
          onClick={() =>
            session
              ? setOpenAddComments(!openAddComments)
              : alert('Please login to add a comment')
          }
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
        <div className="text-color-subtext">No comments yet</div>
      ) : (
        optimisticComments.map((comment) => {
          return (
            <div
              key={comment.id || `optimistic-comment-${crypto.randomUUID()}`}
              className={` p-4 rounded-lg mb-3 shadow-sm transition-colors duration-300 ${
                comment.isNewComment ? 'bg-yellow-100 dark:bg-green-950' : ''
              }`}
            >
              <CommentContent
                comment={comment}
                postId={postId}
                deleteCallback={deleteCallback}
              />
            </div>
          )
        })
      )}
    </div>
  )
}

export default CommentList
