interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: string
  id?: string
  defaultValue?: string
  disabled?: boolean
  readOnly?: boolean
  className?: string
  placeholder?: string
}

export const Input = ({ type = 'text', className, ...props }: InputProps) => {
  return (
    <input
      type={type}
      className={`w-full px-3 py-2 bg-color-background border border-color-border rounded-md focus:ring-color-border focus:ring-2 ${className}`}
      {...props}
    />
  )
}
