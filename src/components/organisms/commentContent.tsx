import { CommentType } from '@/types/comment'
import Tooltip from '../atoms/tooltip'
import { useEffect, useOptimistic, useState } from 'react'
import { CommentEdit } from './commentEdit'
import { VoteButtons } from '@/components/molecules/voteButtons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useSession } from 'next-auth/react'
import { fromNowShort } from '@/utils/dateFormatter'
import { deleteComment } from '@/process/actions/commentAction'
import { Button } from '../atoms/button'
dayjs.extend(relativeTime)

interface CommentContentProps {
  comment: Partial<CommentType>
  postId?: number | null
  deleteCallback?: (commentId: number) => void
}

const CommentContent: React.FC<CommentContentProps> = ({
  comment,
  postId,
  deleteCallback,
}) => {
  const { data: session } = useSession()
  const [commentState, setCommentState] =
    useState<Partial<CommentType>>(comment)
  const [openComments, setOpenComments] = useState<boolean>(false)
  const [openReply, setOpenReply] = useState<boolean>(false)
  const [childComments, setChildComments] = useState<
    Partial<CommentType & { isNewComment: boolean }>[]
  >(comment.childComments ?? [])
  const [isEditing, setIsEditing] = useState<string | number | null>(null)

  useEffect(() => {
    setCommentState(comment)
    setChildComments(comment.childComments ?? [])
  }, [comment])

  const [optimisticChildComments, addOptimisticChildComments] = useOptimistic(
    childComments,
    (
      currentState,
      optimisticValue: Partial<CommentType & { isNewComment: boolean }>
    ) => {
      return [optimisticValue, ...currentState]
    }
  )

  const onReply = (parentCommentId: number) => {
    console.log('reply', parentCommentId, postId)
    setOpenReply(!openReply)
    if (!openReply) {
      setOpenComments(true)
    }
  }

  const onEdit = (commentId: number) => {
    setIsEditing(commentId)
  }

  const onDelete = async (commentId: number) => {
    const response = await deleteComment({ id: commentId })
    if (response.success) {
      setChildComments(
        childComments.filter((comment) => comment.id !== commentId)
      )
      deleteCallback?.(commentId)
    }
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

  const editCallback = (
    editedComment: Partial<CommentType>,
    isOptimistic: boolean
  ) => {
    // setIsEditing(null)
    if (editedComment.id === comment.id) {
      setCommentState({ ...comment, ...editedComment })
    }
    const childCommentIndex = childComments.findIndex(
      (child) => child.id === editedComment.id
    )
    if (childCommentIndex !== -1) {
      const newChildComments = [...childComments]
      newChildComments[childCommentIndex] = {
        ...newChildComments[childCommentIndex],
        ...editedComment,
      }
      setChildComments(newChildComments)
    }
  }

  const renderComments = (comment: Partial<CommentType>) => {
    const isOwner = comment.createdBy == session?.user?.id
    return (
      <div className="space-y-2">
        {/* info bar  */}
        <div className="flex items-center gap-2 text-[12px] text-color-subtext">
          <Button
            size="xsmall"
            color="fade"
            boxStyle="box"
            leftIcon="person"
            label={`${comment.createdUser?.userInfo?.displayName}`}
          />
          <Tooltip
            text={dayjs(comment.createdAt).format('YYYY/MM/DD HH:mm')}
            width="115px"
            className="text-center"
          >
            <span>
              {comment.createdAt ? fromNowShort(comment.createdAt) : ''}
            </span>
          </Tooltip>
          {isOwner && onEdit && (
            <Button
              onClick={() => comment.id && onEdit(comment.id)}
              size="xsmall"
              color="neutral"
              boxStyle="box"
              leftIcon="edit"
            >
              Edit
            </Button>
          )}
          {isOwner && onDelete && (
            <Button
              onClick={() => comment.id && onDelete(comment.id)}
              size="xsmall"
              color="neutral"
              boxStyle="box"
              leftIcon="delete"
            >
              Delete
            </Button>
          )}
        </div>

        {/* edit  */}
        {isEditing === comment.id ? (
          <CommentEdit
            onCloseEdit={() => setIsEditing(null)}
            postId={postId}
            parentCommentId={comment.parentCommentId}
            commentContent={comment.commentContent}
            commentId={comment.id}
            submitCallback={editCallback}
          />
        ) : (
          /* content  */
          <p className="text-color-foreground">{comment.commentContent}</p>
        )}

        {/* action bar  */}
        <div className="flex items-center text-[12px] text-color-subtext mt-2 gap-2">
          {optimisticChildComments.length > 0 &&
            comment.parentCommentId === null && (
              <button onClick={onOpenComments}>
                {openComments
                  ? 'Hide replies'
                  : `Show replies (${optimisticChildComments.length})`}
              </button>
            )}
          {session && onReply && comment.parentCommentId === null && (
            <Button
              onClick={() => comment.id && onReply(comment.id)}
              size="xsmall"
              color="neutral"
              boxStyle="box"
              leftIcon="reply"
            >
              Reply
            </Button>
          )}
          <VoteButtons
            commentId={comment.id}
            voteCount={comment._count?.votes || 0}
            canVote={Boolean(session)}
            userVotes={comment.votes}
          />
        </div>

        {/* reply  */}
        {openReply && comment.parentCommentId === null && (
          <CommentEdit
            onCloseEdit={() => setOpenReply(false)}
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
      {renderComments(commentState)}
      {openComments && (
        <div className="border-l-2 border-color-border ">
          {optimisticChildComments.map((childComment) => (
            <div
              key={
                childComment.id ||
                `optimistic-child-comment-${crypto.randomUUID()}`
              }
              className={`mt-2 ml-4 p-2 rounded-lg ${
                childComment.isNewComment
                  ? 'mt-2 bg-yellow-100 dark:bg-green-950'
                  : ''
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
