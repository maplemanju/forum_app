'use client'

import { forwardRef } from 'react'

export type SelectOption = {
  value: string | number
  label: string
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[]
  label?: string
  error?: string
  className?: string
  labelClassName?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { options, label, error, className = '', labelClassName = '', ...props },
    ref
  ) => {
    return (
      <div className="flex items-center gap-2">
        {label && (
          <label className={`block mb-1 text-foreground ${labelClassName}`}>
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`
            bg-background
            border border-border
            rounded-md
            text-foreground
            focus:ring-2 focus:ring-primary focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-danger' : ''}
            ${className}
          `}
          {...props}
        >
          {/* <option value="">Select...</option> */}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-danger">{error}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'
