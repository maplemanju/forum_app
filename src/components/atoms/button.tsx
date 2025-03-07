import { ButtonHTMLAttributes } from 'react'
import Link from 'next/link'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string
  leftIcon?: string
  rightIcon?: string
  size?: 'small' | 'medium' | 'large' | 'xsmall'
  color?: 'primary' | 'gray' | 'danger' | 'neutral' | 'fade' | 'accent'
  linkPath?: string
  boxStyle?: 'box' | 'rect'
  type?: 'button' | 'submit'
}

export const Button = ({
  className,
  label,
  leftIcon,
  rightIcon,
  size = 'medium',
  color = 'primary',
  linkPath,
  boxStyle = 'rect',
  type = 'button',
  ...props
}: ButtonProps) => {
  const sizeClass = {
    box: {
      xsmall: 'px-[4px] py-[4px] text-[12px]',
      small: 'px-[6px] py-[6px] text-sm',
      medium: 'px-[8px] py-[8px] text-base',
      large: 'px-[12px] py-[12px] text-lg',
    },
    rect: {
      xsmall: 'px-2 py-[4px] text-[12px]',
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
    accent: 'bg-color-accent hover:bg-color-accent-hover text-white',
  }
  const iconSize = {
    xsmall: '14px',
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
            className={`material-symbols-rounded`}
            style={{ fontSize: iconSize[size] }}
          >
            {leftIcon}
          </span>
        )}
        {label && <span>{label}</span>}
        {rightIcon && (
          <span
            className={`material-symbols-rounded`}
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
