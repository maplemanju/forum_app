'use client'
// InitializedMDXEditor.tsx
import type { ForwardedRef } from 'react'
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  toolbarPlugin,
  diffSourcePlugin,
  linkDialogPlugin,
  linkPlugin,
  codeBlockPlugin,
  imagePlugin,
  type MDXEditorMethods,
  type MDXEditorProps,
  BoldItalicUnderlineToggles,
  //toolbars
  UndoRedo,
  DiffSourceToggleWrapper,
  InsertThematicBreak,
  StrikeThroughSupSubToggles,
  InsertImage,
  CreateLink,
  ListsToggle,
  BlockTypeSelect,
  CodeToggle,
  Separator,
  ButtonWithTooltip,
} from '@mdxeditor/editor'

export default function TextEditorInitialize({
  editorRef,
  toggleButton,
  setToRawEditor,
  ...props
}: {
  editorRef: ForwardedRef<MDXEditorMethods> | null
  setToRawEditor: () => void
  toggleButton: () => React.ReactNode
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
      contentEditableClassName="content-editable"
    />
  )
}
