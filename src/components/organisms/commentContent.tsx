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
import { UserInfoCard } from '@/components/molecules/userInfoCard'
import { CommentSkeleton } from '../molecules/skeletons/commentSkeleton'

dayjs.extend(relativeTime)

interface CommentContentProps {
  comment: Partial<CommentType>
  postId?: number | null
}

const CommentContent: React.FC<CommentContentProps> = ({ comment, postId }) => {
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
      <div className="w-full">
        <div className="md:flex gap-4">
          {/* User Info - Full card for main comments */}
          <div>
            <UserInfoCard user={comment.createdUser} />
          </div>

          {/* Comment Content */}
          <div className="flex-1">
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
                  {serializedContent ? (
                    <MDXContent source={serializedContent} />
                  ) : (
                    <CommentSkeleton />
                  )}
                </div>

                {/* info bar  */}
                <div className="flex items-center gap-2 text-[12px] text-color-subtext mt-2">
                  {/* Show user info button only on mobile */}
                  <Tooltip
                    text={`Posted at ${dayjs(comment.createdAt).format(
                      'YYYY/MM/DD HH:mm'
                    )}`}
                    width="115px"
                    className="text-center"
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-rounded text-sm">
                        today
                      </span>
                      <span>
                        {comment.createdAt
                          ? fromNowShort(comment.createdAt)
                          : ''}
                      </span>
                    </div>
                  </Tooltip>
                  {/* updated at  */}
                  {!dayjs(comment.updatedAt).isSame(
                    dayjs(comment.createdAt)
                  ) && (
                    <Tooltip
                      text={`Edited at ${dayjs(comment.updatedAt).format(
                        'YYYY/MM/DD HH:mm'
                      )}`}
                      width="115px"
                      className="text-center"
                    >
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-rounded text-sm">
                          update
                        </span>
                        <span>
                          {comment.updatedAt
                            ? fromNowShort(comment.updatedAt)
                            : ''}
                        </span>
                      </div>
                    </Tooltip>
                  )}
                  {canEdit && onEdit && (
                    <div>
                      <Button
                        onClick={() => onEdit()}
                        size="xsmall"
                        color="neutral"
                        boxStyle="box"
                        leftIcon="edit"
                      >
                        Edit
                      </Button>
                    </div>
                  )}
                </div>

                {/* action bar  */}
                <div className="flex items-center text-[12px] text-color-subtext mt-2 gap-2">
                  {comment.childComments &&
                    comment.childComments.length > 0 && (
                      <button onClick={openRepliesLink}>
                        {openReplies
                          ? 'Hide replies'
                          : `Show replies (${comment.childComments?.length})`}
                      </button>
                    )}
                  {session && onReply && (
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

                {/* Replies - Moved inside the comment content area */}
                {openReplies && postId && comment.id && (
                  <div className="mt-4 pl-4">
                    <ReplyList
                      replies={comment.childComments ?? []}
                      openReply={openReply}
                      setOpenReply={setOpenReply}
                      parentPostId={postId}
                      parentCommentId={comment.id}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return renderComments(commentState)
}

export default CommentContent
