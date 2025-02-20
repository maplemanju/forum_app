import { useState, useEffect } from 'react'

export const useLoginPopup = () => {
  const [popupWindow, setPopupWindow] = useState<Window | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const openLoginPopup = () => {
    // Close existing popup if it's still around
    if (popupWindow) {
      popupWindow.close()
    }

    const width = 500
    const height = 600
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2

    const popup = window.open(
      '/login',
      '_blank',
      `width=${width},height=${height},left=${left},top=${top},popup=yes,resizable=no`
    )

    if (popup) {
      // Try to add event listener
      popup.onbeforeunload = () => {
        setIsOpen(false)
        setPopupWindow(null)
      }
      setPopupWindow(popup)
      setIsOpen(true)
    }
  }

  useEffect(() => {
    if (!popupWindow) return

    // Fallback check for popup status
    const checkPopup = setInterval(() => {
      if (popupWindow.closed) {
        setIsOpen(false)
        setPopupWindow(null)
        clearInterval(checkPopup)
      }
    }, 500)

    return () => {
      clearInterval(checkPopup)
      if (popupWindow) {
        popupWindow.close()
      }
    }
  }, [popupWindow])

  const closePopup = () => {
    if (popupWindow) {
      popupWindow.close()
      setIsOpen(false)
      setPopupWindow(null)
    }
  }

  return {
    openLoginPopup,
    closePopup,
    isOpen,
  }
}
