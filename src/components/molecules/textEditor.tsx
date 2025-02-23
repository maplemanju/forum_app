'use client'

import dynamic from 'next/dynamic'
import { type MDXEditorMethods, type MDXEditorProps } from '@mdxeditor/editor'
import { forwardRef, useRef, useState, useCallback, useEffect } from 'react'

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
  const [content, setContent] = useState(props.markdown || '')

  useEffect(() => {
    if (content) {
      props.onChangeCallback(content)
    }
  }, [content, props.onChangeCallback])

  const handleChange = (markdown: string) => {
    setContent(markdown)
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
      {isMdxEditor && !props.isTextAreaOnly ? (
        <Editor
          {...props}
          markdown={content}
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
              value={content}
              rows={10}
              onChange={(e) => handleChange(e.target.value)}
            />
          </div>
        </>
      )}
    </div>
  )
}
