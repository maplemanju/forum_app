'use client'

import React from 'react'
import CommentContent from '@/common/components/widgets/commentContent'
import { CommentType } from '@/types/comment'

interface CommentsProps {
  comments: CommentType[]
  postId?: number | null
}

const CommentList: React.FC<CommentsProps> = ({ comments, postId }) => {
  return (
    <div className="space-y-4 mt-6">
      <h2 className="text-2xl font-bold text-gray-900">Comments</h2>
      {comments.length === 0 ? (
        <div className="text-gray-600">No comments yet</div>
      ) : (
        comments.map((comment) => {
          return (
            <div
              key={comment.id}
              className="bg-white p-4 rounded-lg mb-3 shadow-sm"
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
