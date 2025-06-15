'use client'

import React, { useActionState, useCallback, useEffect, useState } from 'react'
import {
  createComment,
  updateComment,
  CreateCommentResponse,
} from '@/process/actions/commentAction'
import { CommentType } from '@/types/comment'
import { Alert } from '@/components/atoms/alerts'
import { Button } from '@/components/atoms/button'
import { TextEditor } from '@/components/molecules/textEditor'

export const CommentEdit = ({
  onCloseEdit,
  postId,
  parentCommentId,
  commentId,
  commentContent,
  submitCallback,
}: {
  onCloseEdit: () => void
  postId?: number | null
  parentCommentId?: number | null
  commentId?: number | null
  commentContent?: string
  submitCallback?: (
    comment: Partial<CommentType>,
    isOptimistic: boolean
  ) => void
}) => {
  const [content, setContent] = useState<string>(commentContent || '')

  useEffect(() => {
    if (commentContent) {
      setContent(commentContent)
    }
  }, [commentContent])

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent)
  }, [])

  const handleSubmit = async (
    prevState: CreateCommentResponse,
    formData: FormData
  ) => {
    const args = {
      id: formData.get('commentId')
        ? Number(formData.get('commentId'))
        : undefined,
      postId: Number(formData.get('postId')),
      commentContent: content,
      parentCommentId: formData.get('parentCommentId')
        ? Number(formData.get('parentCommentId'))
        : null,
    }

    submitCallback?.(args, true)
    let response
    if (args.id) {
      response = await updateComment({ ...args, id: args.id })
    } else {
      response = await createComment(args)
    }

    if (response.data) {
      submitCallback?.(response.data, false)
      onCloseEdit()
      return response
    }
    return { data: args }
  }
  const [formState, formAction, isPending] = useActionState(handleSubmit, {
    data: {
      commentContent: content,
    },
  })

  return (
    <div>
      <Alert response={formState} />
      <form action={formAction} className="space-y-4">
        <input id="postId" type="hidden" name="postId" value={postId ?? ''} />
        <input
          id="parentCommentId"
          type="hidden"
          name="parentCommentId"
          value={parentCommentId ?? ''}
        />
        <input
          id="commentId"
          type="hidden"
          name="commentId"
          value={commentId ?? ''}
        />
        <div className="post-content mb-4">
          <TextEditor
            markdown={content}
            onChangeCallback={handleContentChange}
            isTextAreaOnly={Boolean(parentCommentId)} // textArea only for replies
            className="!h-40"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            onClick={onCloseEdit}
            label="Cancel"
            color="gray"
            leftIcon="cancel"
            size="small"
          />
          <Button
            type="submit"
            disabled={isPending}
            label={isPending ? 'Sending...' : 'Send'}
            leftIcon="send"
            size="small"
          />
        </div>
      </form>
    </div>
  )
}

export default CommentEdit
