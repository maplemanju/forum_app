import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string
  leftIcon?: string
  rightIcon?: string
  size?: 'small' | 'medium' | 'large'
  color?: 'primary' | 'gray' | 'danger' | 'neutral'
}

export const Button = ({
  children,
  className,
  label,
  leftIcon,
  rightIcon,
  size = 'medium',
  color = 'primary',
  ...props
}: ButtonProps) => {
  const sizeClass = {
    small: 'px-2 py-1 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  }
  const colorClass = {
    primary: 'bg-color-primary hover:bg-color-primary-hover text-white',
    gray: 'bg-color-gray hover:bg-color-gray-hover text-white',
    danger: 'bg-color-danger hover:bg-color-danger-hover text-white',
    neutral:
      'bg-color-neutral hover:bg-color-neutral-hover text-color-foreground',
  }
  const iconSize = {
    small: '16px',
    medium: '20px',
    large: '24px',
  }
  return (
    <button
      className={`rounded-md  flex items-center gap-2 ${colorClass[color]} ${
        sizeClass[size]
      } ${className || ''}`}
      {...props}
    >
      {leftIcon && (
        <span className={`material-icons`} style={{ fontSize: iconSize[size] }}>
          {leftIcon}
        </span>
      )}
      {label && <span>{label}</span>}
      {rightIcon && (
        <span className={`material-icons`} style={{ fontSize: iconSize[size] }}>
          {rightIcon}
        </span>
      )}
    </button>
  )
}
