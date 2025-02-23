import React from 'react'
import { createPortal } from 'react-dom'

type Props = {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

export default function Modal({ open, onClose, children }: Props) {
  const handleOverlayClick = (event: React.SyntheticEvent) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-10" role="dialog" aria-modal="true">
      {/** overlay */}
      <div className="fixed inset-0 bg-color-overlay" aria-hidden="true"></div>
      {/** modal */}
      <div
        className="fixed inset-0 flex items-center justify-center"
        onClick={handleOverlayClick}
      >
        <div className="w-full max-w-lg rounded-lg shadow-lg p-6 bg-color-background-secondary">
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}
