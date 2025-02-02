'use client'

import React, { useState, useEffect, useOptimistic } from 'react'
import CommentContent from '@/common/components/widgets/commentContent'
import { CommentType } from '@/types/comment'
import { CommentEdit } from './commentEdit'

interface CommentsProps {
  comments: CommentType[]
  postId?: number | null
}

const CommentList: React.FC<CommentsProps> = ({ comments, postId }) => {
  const [openAddComments, setOpenAddComments] = useState(false)
  const [commentsState, setCommentsState] =
    useState<Partial<CommentType & { isNewComment: boolean }>[]>(comments)

  useEffect(() => {
    setCommentsState(comments ?? [])
  }, [comments])

  const [optimisticComments, addOptimisticComments] = useOptimistic(
    commentsState,
    (currentState, optimisticValue: Partial<CommentType>) => {
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
    <div className="space-y-4 mt-6">
      <div className="mb-4">
        <button
          onClick={() => setOpenAddComments(!openAddComments)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Comment
        </button>
      </div>
      {openAddComments && (
        <CommentEdit
          onCloseEdit={() => setOpenAddComments(false)}
          postId={postId}
          submitCallback={submitCallback}
        />
      )}
      {optimisticComments.length === 0 ? (
        <div className="text-gray-600">No comments yet</div>
      ) : (
        optimisticComments.map((comment) => {
          return (
            <div
              key={comment.id || `optimistic-comment-${crypto.randomUUID()}`}
              className={`bg-white p-4 rounded-lg mb-3 shadow-sm transition-colors duration-300 ${
                comment.isNewComment ? 'bg-yellow-100' : ''
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
