import React, { useEffect, useState } from 'react'
import {
  closeImageDialog$,
  imageDialogState$,
  imageUploadHandler$,
  saveImage$,
} from '@mdxeditor/editor'
import { useCellValues, usePublisher } from '@mdxeditor/gurx'
import Modal from '@/components/atoms/modal'
import { Input } from '@/components/atoms/input'
import { Button } from '@/components/atoms/button'

interface ImageFormFields {
  src: string
  title: string
  altText: string
  file: FileList
}

export const ImageDialog: React.FC = () => {
  const [state, imageUploadHandler] = useCellValues(
    imageDialogState$,
    imageUploadHandler$
  )
  const saveImage = usePublisher(saveImage$)
  const closeImageDialog = usePublisher(closeImageDialog$)

  const [formState, setFormState] = useState<ImageFormFields | null>(null)

  useEffect(() => {
    setFormState(state.type === 'editing' ? (state.initialValues as any) : {})
  }, [state])

  const handleSubmit = async (formData: FormData) => {
    const args: ImageFormFields = {
      src: formData.get('src') as string,
      title: formData.get('title') as string,
      altText: formData.get('altText') as string,
      file: formData.get('file') as unknown as FileList,
    }

    if (args.src) {
      saveImage(args)
    }
    setFormState(null)
  }

  const handleClose = () => {
    setFormState(null)
    closeImageDialog()
  }

  return (
    <Modal open={state.type !== 'inactive'} onClose={handleClose}>
      <form action={handleSubmit} className="space-y-2">
        {imageUploadHandler === null ? (
          <input type="hidden" accept="image/*" id="file" name="file" />
        ) : (
          <div>
            <label htmlFor="file">Upload an image from your device:</label>
            <input type="file" accept="image/*" id="file" name="file" />
          </div>
        )}

        <div>
          <label htmlFor="src">Add an image URL:</label>
          <Input id="src" name="src" defaultValue={formState?.src} />
        </div>

        <div>
          <label htmlFor="alt">Alt:</label>
          <Input
            id="altText"
            name="altText"
            defaultValue={formState?.altText}
          />
        </div>

        <div>
          <label htmlFor="title">Title:</label>
          <Input id="title" name="title" defaultValue={formState?.title} />
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            onClick={handleClose}
            label="Cancel"
            color="gray"
            size="small"
          />
          <Button type="submit" label="Add" size="small" color="primary" />
        </div>
      </form>
    </Modal>
  )
}
