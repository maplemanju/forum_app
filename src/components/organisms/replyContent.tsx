'use client'

import { ReplyType } from '@/types/comment'
import Tooltip from '../atoms/tooltip'
import { useEffect, useState } from 'react'
import { CommentEdit } from './commentEdit'
import { VoteButtons } from '@/components/molecules/voteButtons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useSession } from 'next-auth/react'
import { fromNowShort } from '@/utils/dateFormatter'
import { Button } from '../atoms/button'
import { mdxSerializer } from '@/utils/mdxSerializer'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { MDXContent } from '../templates/MDXContent'
import { ROLES } from '@/utils/consts'
import { CommentSkeleton } from '../molecules/skeletons/commentSkeleton'
import Link from 'next/link'

dayjs.extend(relativeTime)

interface ReplyContentProps {
  comment: Partial<ReplyType>
  postId?: number | null
}

const ReplyContent: React.FC<ReplyContentProps> = ({ comment, postId }) => {
  const { data: session } = useSession()
  const [commentState, setCommentState] = useState<Partial<ReplyType>>(comment)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [serializedContent, setSerializedContent] =
    useState<MDXRemoteSerializeResult | null>(null)

  useEffect(() => {
    setCommentState(comment)
  }, [comment])

  const onEdit = () => {
    setIsEditing(!isEditing)
  }

  const editCallback = (editedComment: Partial<ReplyType>) => {
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

  const renderReply = (comment: Partial<ReplyType>) => {
    const canEdit =
      session &&
      (session.user.id === comment.createdBy ||
        session.user.roles?.includes(ROLES.ADMIN))

    return (
      <article className="w-full flex-1" role="comment">
        {/* Comment Content */}
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
            {/* info bar  */}
            <div
              className="text-subtext flex items-center gap-2 text-[12px]"
              role="group"
            >
              <Link href={`/profile/${comment.createdUser?.publicId}`}>
                {comment.createdUser?.userInfo?.displayName}
              </Link>
              <Tooltip
                text={`Posted at ${dayjs(comment.createdAt).format(
                  'YYYY/MM/DD HH:mm'
                )}`}
                width="115px"
                className="text-center"
              >
                <time
                  dateTime={comment.createdAt?.toISOString()}
                  className="flex items-center gap-2"
                >
                  <span
                    className="material-symbols-rounded !text-sm"
                    aria-hidden
                  >
                    today
                  </span>
                  <span>
                    {comment.createdAt ? fromNowShort(comment.createdAt) : ''}
                  </span>
                </time>
              </Tooltip>
              {/* updated at  */}
              {!dayjs(comment.updatedAt).isSame(dayjs(comment.createdAt)) && (
                <Tooltip
                  text={`Edited at ${dayjs(comment.updatedAt).format(
                    'YYYY/MM/DD HH:mm'
                  )}`}
                  width="115px"
                  className="text-center"
                >
                  <time
                    dateTime={comment.updatedAt?.toISOString()}
                    className="flex items-center gap-2"
                  >
                    <span
                      className="material-symbols-rounded !text-sm"
                      aria-hidden
                    >
                      update
                    </span>
                    <span>
                      {comment.updatedAt ? fromNowShort(comment.updatedAt) : ''}
                    </span>
                  </time>
                </Tooltip>
              )}
              {canEdit && onEdit && (
                <Button
                  onClick={() => onEdit()}
                  size="xsmall"
                  color="neutral"
                  boxStyle="box"
                  leftIcon="edit"
                  aria-label="Edit comment"
                />
              )}
            </div>

            {/* content  */}
            <div className="post-content">
              {serializedContent ? (
                <MDXContent source={serializedContent} />
              ) : (
                <CommentSkeleton />
              )}
            </div>

            {/* action bar  */}
            <div className="text-subtext flex items-center gap-2 text-[12px]">
              <VoteButtons
                commentId={comment.id}
                voteCount={comment._count?.votes || 0}
                canVote={Boolean(session)}
                userVotes={comment.votes}
              />
            </div>
          </div>
        )}
      </article>
    )
  }

  return renderReply(commentState)
}

export default ReplyContent
