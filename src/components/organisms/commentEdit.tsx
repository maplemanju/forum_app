import React, { useActionState, useState } from 'react'
import {
  createComment,
  updateComment,
  CreateCommentResponse,
} from '@/process/actions/commentAction'
import { CommentType } from '@/types/comment'
import { Alert } from '@/components/atoms/alerts'
import { Button } from '@/components/atoms/button'

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
  const handleSubmit = async (
    prevState: CreateCommentResponse,
    formData: FormData
  ) => {
    const args = {
      id: formData.get('commentId')
        ? Number(formData.get('commentId'))
        : undefined,
      postId: Number(formData.get('postId')),
      commentContent: formData.get('commentContent') as string,
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
    console.log('response.data', response.data)

    if (response.data) {
      submitCallback?.(response.data, false)
      onCloseEdit()
      return response
    }
    return prevState
  }
  const [formState, formAction, isPending] = useActionState(handleSubmit, {})

  return (
    <div>
      <Alert response={formState} />
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="postId" value={postId ?? ''} />
        <input
          type="hidden"
          name="parentCommentId"
          value={parentCommentId ?? ''}
        />
        <input type="hidden" name="commentId" value={commentId ?? ''} />
        <div className="mb-4">
          <textarea
            id="commentContent"
            name="commentContent"
            rows={10}
            className="w-full px-3 py-2 bg-color-background border border-color-border rounded-md"
            required
            defaultValue={commentContent ?? ''}
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
