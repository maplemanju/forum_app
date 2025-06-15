'use client'

import { ResponseType } from '@/utils/errors'

type AlertProps = {
  response?: ResponseType<unknown>
}

export const Alert = ({ response }: AlertProps) => {
  if (!response || !response.message) return <></>

  const alertStyles = {
    error: 'bg-background-secondary border-danger text-danger',
    success: 'bg-background-secondary border-success text-success',
    warning: 'bg-background-secondary border-warning text-warning',
    info: 'bg-background-secondary border-info text-info',
  }

  return (
    <div
      className={`${
        alertStyles[response.type || 'info']
      } relative mb-4 rounded border px-4 py-3`}
      role="alert"
      aria-live="assertive"
    >
      <span className="block sm:inline">{response.message}</span>
    </div>
  )
}
