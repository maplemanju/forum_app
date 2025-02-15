'use client'

import { ResponseType } from '@/utils/errors'

type AlertProps = {
  response?: ResponseType<unknown>
}

export const Alert = ({ response }: AlertProps) => {
  if (!response || !response.message) return <></>

  const alertStyles = {
    error:
      'bg-color-background-secondary border-color-danger text-color-danger',
    success:
      'bg-color-background-secondary border-color-success text-color-success',
    warning:
      'bg-color-background-secondary border-color-warning text-color-warning',
    info: 'bg-color-background-secondary border-color-info text-color-info',
  }

  return (
    <div
      className={`${
        alertStyles[response.type || 'info']
      } border px-4 py-3 rounded relative mb-4`}
      role="alert"
    >
      <span className="block sm:inline">{response.message}</span>
    </div>
  )
}
