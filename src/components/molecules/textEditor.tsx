'use client'

import dynamic from 'next/dynamic'
import { type MDXEditorMethods } from '@mdxeditor/editor'
import { useRef, useState, useEffect } from 'react'
import { EditorSwitchButton } from '@/components/atoms/mdxEditor/editorSwitchButton'
import { EditorSkeleton } from '@/components/molecules/skeletons/editorSkeleton'
import { debounce } from 'lodash'

// This is the only place TextEditor is imported directly.
const Editor = dynamic(() => import('../atoms/textEditorInitialize'), {
  // Make sure we turn SSR off
  ssr: false,
  loading: () => {
    return <EditorSkeleton />
  },
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
    setContent((prev) => {
      if (markdown !== prev) {
        // Force update the editor
        if (editorRef.current) {
          editorRef.current.setMarkdown(markdown || '')
        }
        return markdown || ''
      }
      return prev
    })
  }, [markdown])

  const handleChange = debounce((newContent: string) => {
    setContent(newContent)
  }, 300) // 300ms delay

  return (
    <div>
      {isMdxEditor && !isTextAreaOnly ? (
        <Editor
          markdown={markdown}
          editorRef={editorRef}
          onChange={handleChange}
          setToRawEditor={() => setIsMdxEditor(false)}
          className={className}
          onBlur={() => onChangeCallback(content)}
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
                value={markdown}
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
