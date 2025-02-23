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

  //toolbars
  UndoRedo,
  InsertThematicBreak,
  StrikeThroughSupSubToggles,
  InsertImage,
  CreateLink,
  ListsToggle,
  BlockTypeSelect,
  Separator,
  ButtonWithTooltip,
} from '@mdxeditor/editor'

export default function TextEditorInitialize({
  editorRef,
  toggleButton,
  setToRawEditor,
  className,
  ...props
}: {
  editorRef: ForwardedRef<MDXEditorMethods> | null
  setToRawEditor: () => void
  toggleButton: () => React.ReactNode
  className?: string
} & MDXEditorProps) {
  return (
    <MDXEditor
      plugins={[
        headingsPlugin(),
        quotePlugin(),
        linkPlugin(),
        thematicBreakPlugin(),
        listsPlugin(),
        imagePlugin(),
        linkDialogPlugin(),
        toolbarPlugin({
          toolbarClassName: 'editor-toolbar',
          toolbarContents: () => (
            <>
              <UndoRedo />
              <Separator />
              <BoldItalicUnderlineToggles />
              <Separator />
              <StrikeThroughSupSubToggles />
              <Separator />
              <ListsToggle />
              <Separator />
              <BlockTypeSelect />
              <CreateLink />
              <InsertImage />
              <InsertThematicBreak />
              <ButtonWithTooltip
                title="Switch to Raw Editor"
                onClick={setToRawEditor}
              >
                {toggleButton()}
              </ButtonWithTooltip>
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
