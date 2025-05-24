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
    setFormState(
      state.type === 'editing' ? (state.initialValues as ImageFormFields) : null
    )
  }, [state])

  const handleSubmit = async (formData: FormData) => {
    const fileInput = document.querySelector('#file') as HTMLInputElement

    const args: ImageFormFields = {
      title: formData.get('title') as string,
      altText: formData.get('altText') as string,
      file: fileInput.files as FileList,
    }

    saveImage(args)
    setFormState(null)
  }

  const handleClose = () => {
    setFormState(null)
    closeImageDialog()
  }

  return (
    <Modal open={state.type !== 'inactive'} onClose={handleClose}>
      <form action={handleSubmit} className="space-y-2">
        {imageUploadHandler !== null && (
          <div>
            <label htmlFor="file">Upload an image from your device:</label>
            <input
              type="file"
              accept="image/*"
              id="file"
              name="file"
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-primary file:text-white
                hover:file:bg-primary/90
                cursor-pointer border rounded-md
                p-1"
            />
          </div>
        )}

        {/* <div>
          <label htmlFor="src">Add an image URL:</label>
          <Input id="src" name="src" defaultValue={formState?.src} />
        </div> */}

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
