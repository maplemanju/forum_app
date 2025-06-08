'use client'

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
      <div className="bg-overlay fixed inset-0" aria-hidden="true"></div>
      {/** modal */}
      <div
        className="fixed inset-0 flex items-center justify-center"
        onClick={handleOverlayClick}
      >
        <div className="bg-background-tertiary w-full max-w-lg rounded-lg p-6 shadow-lg">
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}
