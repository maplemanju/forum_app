'use client'

import dynamic from 'next/dynamic'
import { type MDXEditorMethods } from '@mdxeditor/editor'
import { useRef, useState, useEffect } from 'react'
import { Button } from '@/components/atoms/button'
import { EditorSwitchButton } from '@/components/atoms/mdxEditor/editorSwitchButton'

// This is the only place TextEditor is imported directly.
const Editor = dynamic(() => import('../atoms/textEditorInitialize'), {
  // Make sure we turn SSR off
  ssr: false,
})

// This is what is imported by other components. Pre-initialized with plugins, and ready
// to accept other props, including a ref.
type TextEditorProps = {
  markdown: string
  onChangeCallback: (markdown: string) => void
  isTextAreaOnly?: boolean
  className?: string
}

export const TextEditor = ({
  onChangeCallback,
  markdown,
  isTextAreaOnly,
  className,
}: TextEditorProps) => {
  const [isMdxEditor, setIsMdxEditor] = useState<boolean>(true)
  const editorRef = useRef<MDXEditorMethods>(null)
  const [content, setContent] = useState<string>(markdown || '')

  useEffect(() => {
    if (markdown !== content) {
      setContent(markdown || '')
      // Force update the editor
      if (editorRef.current) {
        editorRef.current.setMarkdown(markdown || '')
      }
    }
  }, [markdown])

  const handleChange = (newContent: string) => {
    setContent(newContent)
    onChangeCallback(newContent)
  }

  return (
    <div>
      {isMdxEditor && !isTextAreaOnly ? (
        <Editor
          markdown={content}
          editorRef={editorRef}
          onChange={handleChange}
          setToRawEditor={() => setIsMdxEditor(false)}
          className={className}
        />
      ) : (
        <>
          <div className="editor">
            {!isTextAreaOnly && (
              <div className="editor-toolbar">
                <EditorSwitchButton
                  toggleEditor={() => setIsMdxEditor(!isMdxEditor)}
                  isMdxEditor={true}
                />
              </div>
            )}

            <div>
              <textarea
                className={`w-full px-3 py-2 content-editable ${className}`}
                value={content}
                rows={10}
                onChange={(e) => handleChange(e.target.value)}
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
