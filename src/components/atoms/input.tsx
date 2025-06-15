'use client'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: string
}

export const Input = ({ type = 'text', className, ...props }: InputProps) => {
  return (
    <input
      type={type}
      className={`bg-background border-border focus:ring-border w-full rounded-md border px-3 py-2 focus:ring-2 ${className}`}
      {...props}
    />
  )
}
