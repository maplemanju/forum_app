'use client'

import dynamic from 'next/dynamic'
import { type MDXEditorMethods, type MDXEditorProps } from '@mdxeditor/editor'
import { forwardRef, useRef, useState } from 'react'

// This is the only place TextEditor is imported directly.
const Editor = dynamic(() => import('../atoms/textEditorInitialize'), {
  // Make sure we turn SSR off
  ssr: false,
})

// This is what is imported by other components. Pre-initialized with plugins, and ready
// to accept other props, including a ref.
type TextEditorProps = MDXEditorProps & {
  onChangeCallback: (markdown: string) => void
  isMdxEditor?: boolean
  canToggleEditor?: boolean
}

export const TextEditor = (props: TextEditorProps) => {
  const [isMdxEditor, setIsMdxEditor] = useState<boolean>(
    props.isMdxEditor || false
  )
  const editorRef = useRef<MDXEditorMethods>(null)
  const handleChange = (markdown: string) => {
    console.log('markdown', markdown)
    props.onChangeCallback(markdown)
  }

  const toggleButton = () => {
    return (
      <div onClick={() => setIsMdxEditor(!isMdxEditor)}>
        {isMdxEditor ? 'Switch to Textarea' : 'Switch to MDX Editor'}
      </div>
    )
  }

  return (
    <div>
      {isMdxEditor ? (
        <Editor
          {...props}
          editorRef={editorRef}
          onChange={handleChange}
          toggleButton={toggleButton}
          setToRawEditor={() => setIsMdxEditor(false)}
        />
      ) : (
        <div className="editor">
          <div className="editor-toolbar">
            <button
              type="button"
              onClick={() => setIsMdxEditor(true)}
              className="px-1 py-1.5"
            >
              {toggleButton()}
            </button>
          </div>

          <div>
            <textarea
              className="w-full px-3 py-2 content-editable"
              defaultValue={props.markdown}
              rows={10}
              onChange={(e) => handleChange(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// TS complains without the following line
TextEditor.displayName = 'TextEditor'
