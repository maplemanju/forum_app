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
  StrikeThroughSupSubToggles,
  InsertImage,
  CreateLink,
  BlockTypeSelect,
  Separator,
  ButtonWithTooltip,
  Button,
  UndoRedo,
  ListsToggle,
} from '@mdxeditor/editor'
import { StrikeoutButton } from './mdxEditor/strikeoutButton'
import { ListsButton } from './mdxEditor/listsButton'
import { BlockTypesButton } from './mdxEditor/blockTypesButton'
import { EditorSwitchButton } from './mdxEditor/editorSwitchButton'

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
  return (
    <MDXEditor
      markdown={markdown}
      plugins={[
        headingsPlugin(),
        quotePlugin(),
        linkPlugin(),
        listsPlugin(),
        imagePlugin(),
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
