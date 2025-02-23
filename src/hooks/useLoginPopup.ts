import { useState } from 'react'

export const useLoginPopup = () => {
  const [isOpen, setIsOpen] = useState(false)

  const openLoginPopup = () => {
    const width = 500
    const height = 600
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2

    const popup = window.open(
      '/login',
      'loginPopup',
      `width=${width},height=${height},left=${left},top=${top},popup=yes,location=no,toolbar=no,menubar=no,status=no`
    )

    if (popup) {
      setIsOpen(true)

      // Check if window exists every 500ms
      const checkWindow = setInterval(() => {
        if (!document.hasFocus()) {
          setIsOpen(false)
          clearInterval(checkWindow)
        }
      }, 500)

      // Listen for completion message
      const handleMessage = (event: MessageEvent) => {
        if (event.data === 'login_complete') {
          setIsOpen(false)
          window.removeEventListener('message', handleMessage)
          clearInterval(checkWindow)
        }
      }

      window.addEventListener('message', handleMessage)
    }
  }

  return { openLoginPopup, isOpen }
}
