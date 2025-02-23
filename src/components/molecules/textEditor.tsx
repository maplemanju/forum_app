'use client'

import dynamic from 'next/dynamic'
import { type MDXEditorMethods, type MDXEditorProps } from '@mdxeditor/editor'
import { forwardRef, useRef, useState, useCallback } from 'react'

// This is the only place TextEditor is imported directly.
const Editor = dynamic(() => import('../atoms/textEditorInitialize'), {
  // Make sure we turn SSR off
  ssr: false,
})

// This is what is imported by other components. Pre-initialized with plugins, and ready
// to accept other props, including a ref.
type TextEditorProps = MDXEditorProps & {
  onChangeCallback: (markdown: string) => void
  isTextAreaOnly?: boolean
  canToggleEditor?: boolean
  className?: string
}

export const TextEditor = (props: TextEditorProps) => {
  const [isMdxEditor, setIsMdxEditor] = useState<boolean>(true)
  const editorRef = useRef<MDXEditorMethods>(null)

  const handleChange = useCallback((markdown: string) => {
    console.log('markdown', markdown)
    props.onChangeCallback(markdown)
  }, [])

  const toggleButton = () => {
    return (
      <div onClick={() => setIsMdxEditor(!isMdxEditor)}>
        {isMdxEditor ? 'Switch to Textarea' : 'Switch to MDX Editor'}
      </div>
    )
  }

  return (
    <div>
      {isMdxEditor && !props.isTextAreaOnly ? (
        <Editor
          {...props}
          editorRef={editorRef}
          onChange={handleChange}
          toggleButton={toggleButton}
          setToRawEditor={() => setIsMdxEditor(false)}
        />
      ) : (
        <>
          {!props.isTextAreaOnly && (
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
            </div>
          )}

          <div>
            <textarea
              id="content"
              name="content"
              className={`w-full px-3 py-2 content-editable ${props.className}`}
              defaultValue={props.markdown}
              rows={10}
              onChange={(e) => handleChange(e.target.value)}
            />
          </div>
        </>
      )}
    </div>
  )
}
