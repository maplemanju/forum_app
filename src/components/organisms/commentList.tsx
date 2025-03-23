'use client'

import React, { useState, useEffect, useOptimistic } from 'react'
import CommentContent from '@/components/organisms/commentContent'
import { CommentType } from '@/types/comment'
import { CommentEdit } from './commentEdit'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/atoms/button'
import { useLoginPopup } from '@/hooks/useLoginPopup'
import { useCommentsPaging } from '@/hooks/useCommentsPaging'
import { SortSelect } from '../molecules/sortSelect'
import { useRouter, useSearchParams } from 'next/navigation'
interface CommentsProps {
  comments?: CommentType[]
  postId?: number
  commentCount: number
  sort?: 'oldest' | 'newest' | 'popular' | 'rated'
}

const CommentList: React.FC<CommentsProps> = ({
  comments,
  postId,
  commentCount,
  sort,
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const { openLoginPopup, isOpen: isLoginPopupOpen } = useLoginPopup()
  const [openAddComments, setOpenAddComments] = useState(false)
  const [commentsState, setCommentsState] = useState<
    Partial<CommentType & { isNewComment: boolean }>[]
  >(comments ?? [])

  const { hasMorePrevious, hasMoreNext, handleLoadMore } = useCommentsPaging({
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

  const sortChangeHandler = (value: string) => {
    const current = new URLSearchParams(searchParams)
    current.set('sort', value)
    router.push(`?${current.toString()}`, { scroll: false })
  }
  return (
    <div id="comments" className="mt-6">
      <div className="p-4 mb-4">
        <div className="divider-label flex items-center justify-between">
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
          <SortSelect
            onChange={sortChangeHandler}
            contentType="comment"
            defaultValue={sort}
          />
        </div>

        {openAddComments && (
          <CommentEdit
            onCloseEdit={() => setOpenAddComments(false)}
            postId={postId}
            submitCallback={submitCallback}
          />
        )}
      </div>
      {optimisticComments.length === 0 ? (
        <div className="p-4 text-subtext">No comments yet</div>
      ) : (
        optimisticComments.map((comment) => {
          return (
            <div
              key={comment.id || `optimistic-comment-${crypto.randomUUID()}`}
              className={`p-4 shadow-sm transition-colors duration-300 border-b border-border-secondary ${
                comment.isNewComment ? 'bg-highlight' : ''
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
            onClick={() => handleLoadMore('first')}
            color="fade"
            leftIcon="first_page"
            disabled={!hasMorePrevious}
            aria-label="Jump to first comments"
            // className="!p-2"
          />
          <Button
            onClick={() => handleLoadMore('previous')}
            label="Previous"
            color="fade"
            leftIcon="arrow_back_ios"
            disabled={!hasMorePrevious}
          />
        </div>

        {/* Next + Jump to Latest */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => handleLoadMore('next')}
            label="Next"
            color="fade"
            rightIcon="arrow_forward_ios"
            disabled={!hasMoreNext}
          />
          <Button
            onClick={() => handleLoadMore('last')}
            color="fade"
            rightIcon="last_page"
            disabled={!hasMoreNext}
            aria-label="Jump to last comments"
            // className="!p-2"
          />
        </div>
      </div>
    </div>
  )
}

export default CommentList
