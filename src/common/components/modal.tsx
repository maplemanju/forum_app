import React from 'react'

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

  return open ? (
    <div className="fixed inset-0 z-10" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500/75" aria-hidden="true"></div>
      <div
        className="fixed inset-0 flex items-center justify-center p-4"
        onClick={handleOverlayClick}
      >
        <div className="w-full max-w-lg rounded-lg bg-white shadow-xl p-6">
          {children}
        </div>
      </div>
    </div>
  ) : (
    <></>
  )
}
