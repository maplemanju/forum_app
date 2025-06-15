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
          <label
            className={`text-foreground mb-1 block ${labelClassName}`}
            htmlFor={props.id}
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`bg-background border-border text-foreground focus:ring-primary rounded-md border focus:border-transparent focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${error ? 'border-danger' : ''} ${className} `}
          {...props}
        >
          {/* <option value="">Select...</option> */}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-danger mt-1 text-sm">{error}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'
