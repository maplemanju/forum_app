'use client'

import { ResponseType } from '@/utils/errors'

type AlertProps = {
  response?: ResponseType<unknown>
}

export const Alert = ({ response }: AlertProps) => {
  if (!response || !response.message) return <></>

  const alertStyles = {
    error: 'bg-red-100 border-red-400 text-red-700',
    success: 'bg-green-100 border-green-400 text-green-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700',
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
