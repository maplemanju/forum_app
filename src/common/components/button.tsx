import { ButtonHTMLAttributes } from 'react'
import Link from 'next/link'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string
  leftIcon?: string
  rightIcon?: string
  size?: 'small' | 'medium' | 'large'
  color?: 'primary' | 'gray' | 'danger' | 'neutral' | 'fade'
  linkPath?: string
  boxStyle?: 'box' | 'rect'
}

export const Button = ({
  children,
  className,
  label,
  leftIcon,
  rightIcon,
  size = 'medium',
  color = 'primary',
  linkPath,
  boxStyle = 'rect',
  ...props
}: ButtonProps) => {
  const sizeClass = {
    box: {
      small: 'px-[6px] py-[6px]',
      medium: 'px-[8px] py-[8px]',
      large: 'px-[12px] py-[12px]',
    },
    rect: {
      small: 'px-2 py-[6px] text-sm',
      medium: 'px-4 py-[8px] text-base',
      large: 'px-6 py-[12px] text-lg',
    },
  }
  const colorClass = {
    primary: 'bg-color-primary hover:bg-color-primary-hover text-white',
    gray: 'bg-color-gray hover:bg-color-gray-hover text-white',
    danger: 'bg-color-danger hover:bg-color-danger-hover text-white',
    neutral:
      'bg-color-neutral hover:bg-color-neutral-hover text-color-foreground',

    fade: 'hover:bg-color-neutral-hover text-color-foreground',
  }
  const iconSize = {
    small: '16px',
    medium: '20px',
    large: '24px',
  }

  const buttonComponent = () => (
    <button
      className={`rounded-md ${colorClass[color]} ${sizeClass[boxStyle][size]}`}
      {...props}
    >
      <div
        className={`flex items-center gap-2 leading-none  ${className || ''}`}
      >
        {leftIcon && (
          <span
            className={`material-icons`}
            style={{ fontSize: iconSize[size] }}
          >
            {leftIcon}
          </span>
        )}
        {label && <span>{label}</span>}
        {rightIcon && (
          <span
            className={`material-icons`}
            style={{ fontSize: iconSize[size] }}
          >
            {rightIcon}
          </span>
        )}
      </div>
    </button>
  )

  return linkPath ? (
    <Link href={linkPath}>{buttonComponent()}</Link>
  ) : (
    buttonComponent()
  )
}
