import { CommentType } from '@/types/comment'
import Tooltip from '../atoms/tooltip'
import { useEffect, useState } from 'react'
import { CommentEdit } from './commentEdit'
import { VoteButtons } from '@/components/molecules/voteButtons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useSession } from 'next-auth/react'
import { fromNowShort } from '@/utils/dateFormatter'
import { deleteComment } from '@/process/actions/commentAction'
import { Button } from '../atoms/button'
import { ReplyList } from './replyList'
import { mdxSerializer } from '@/utils/mdxSerializer'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { MDXContent } from '../templates/MDXContent'
import { ROLES } from '@/utils/consts'
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
  const [openReplies, setOpenReplies] = useState<boolean>(false)
  const [openReply, setOpenReply] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [serializedContent, setSerializedContent] =
    useState<MDXRemoteSerializeResult | null>(null)

  useEffect(() => {
    setCommentState(comment)
  }, [comment])

  const onReply = (parentCommentId: number) => {
    console.log('reply', parentCommentId, postId)
    setOpenReply(!openReply)
    if (!openReply) {
      setOpenReplies(true)
    }
  }

  const onEdit = () => {
    setIsEditing(!isEditing)
  }

  const onDelete = async () => {
    if (!comment.id) return
    const response = await deleteComment({ id: comment.id })
    if (response.success) {
      deleteCallback?.(comment.id)
    }
  }

  const openRepliesLink = () => {
    setOpenReplies(!openReplies)
    setOpenReply(false)
  }

  const editCallback = (editedComment: Partial<CommentType>) => {
    // setIsEditing(null)
    if (editedComment.id === comment.id) {
      setCommentState({ ...comment, ...editedComment })
    }
  }

  useEffect(() => {
    const serializeContent = async () => {
      try {
        const mdxSource = await mdxSerializer(commentState.commentContent ?? '')
        setSerializedContent(mdxSource)
      } catch (error) {
        console.error('Failed to serialize MDX:', error)
      }
    }

    serializeContent()
  }, [commentState])

  const renderComments = (comment: Partial<CommentType>) => {
    const canEdit =
      session &&
      (session.user.id === comment.createdBy ||
        session.user.roles?.includes(ROLES.ADMIN))

    return (
      <>
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
          {canEdit && onEdit && (
            <Button
              onClick={() => onEdit()}
              size="xsmall"
              color="neutral"
              boxStyle="box"
              leftIcon="edit"
            >
              Edit
            </Button>
          )}
          {canEdit && onDelete && (
            <Button
              onClick={() => onDelete()}
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
        {isEditing ? (
          <CommentEdit
            onCloseEdit={() => setIsEditing(false)}
            postId={postId}
            parentCommentId={comment.parentCommentId}
            commentContent={comment.commentContent}
            commentId={comment.id}
            submitCallback={editCallback}
          />
        ) : (
          <div className="ml-4">
            {/* content  */}
            <div className="post-content mt-3">
              {serializedContent && <MDXContent source={serializedContent} />}
            </div>
            {/* action bar  */}
            <div className="flex items-center text-[12px] text-color-subtext mt-2 gap-2">
              {comment.childComments &&
                comment.childComments.length > 0 &&
                comment.parentCommentId === null && (
                  <button onClick={openRepliesLink}>
                    {openReplies
                      ? 'Hide replies'
                      : `Show replies (${comment.childComments?.length})`}
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
          </div>
        )}
      </>
    )
  }

  return (
    <>
      {renderComments(commentState)}
      {openReplies && postId && comment.id && (
        <ReplyList
          replies={comment.childComments ?? []}
          openReply={openReply}
          setOpenReply={setOpenReply}
          parentPostId={postId}
          parentCommentId={comment.id}
        />
      )}
    </>
  )
}

export default CommentContent
