'use client'

import type { ForwardedRef } from 'react'
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  MDXEditor,
  toolbarPlugin,
  linkDialogPlugin,
  linkPlugin,
  imagePlugin,
  type MDXEditorMethods,
  type MDXEditorProps,
  BoldItalicUnderlineToggles,
  InsertImage,
  CreateLink,
  Separator,
  UndoRedo,
} from '@mdxeditor/editor'
import { StrikeoutButton } from './mdxEditor/strikeoutButton'
import { ListsButton } from './mdxEditor/listsButton'
import { BlockTypesButton } from './mdxEditor/blockTypesButton'
import { EditorSwitchButton } from './mdxEditor/editorSwitchButton'
import { ImageDialog } from './mdxEditor/imageDialog'
import { uploadFile } from '@/process/actions/fileUploadAction'
import { getImagePath } from '@/utils/getImagePath'

export default function TextEditorInitialize({
  editorRef,
  setToRawEditor,
  className,
  markdown,
  ...props
}: {
  editorRef: ForwardedRef<MDXEditorMethods> | null
  setToRawEditor: () => void
  className?: string
  markdown: string
} & MDXEditorProps) {
  const handleImageUpload = async (image: File) => {
    try {
      const response = await uploadFile(image, 'content')
      if (response.success) {
        return getImagePath(response.data?.url || '')
      }
      return ''
    } catch (error) {
      console.error('Upload failed:', error)
      return ''
    }
  }
  return (
    <MDXEditor
      markdown={markdown}
      plugins={[
        headingsPlugin(),
        quotePlugin(),
        linkPlugin(),
        listsPlugin(),
        imagePlugin({
          disableImageResize: true,
          ImageDialog: ImageDialog,
          imageUploadHandler: handleImageUpload,
        }),
        linkDialogPlugin(),
        thematicBreakPlugin(),
        toolbarPlugin({
          toolbarClassName: 'editor-toolbar',
          toolbarContents: () => (
            <>
              <EditorSwitchButton toggleEditor={setToRawEditor} />
              <Separator />
              <UndoRedo />
              <Separator />
              <BoldItalicUnderlineToggles />
              <StrikeoutButton />
              <Separator />
              <ListsButton />
              <Separator />
              <BlockTypesButton />
              <Separator />
              <CreateLink />
              <InsertImage />
            </>
          ),
        }),
      ]}
      {...props}
      ref={editorRef}
      className="editor"
      contentEditableClassName={`content-editable ${className}`}
    />
  )
}
