'use client'

import { Select, SelectOption } from '@/components/atoms/select'

const sortOptions: SelectOption[] = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rated', label: 'Highest Rated' },
]

interface SortSelectProps {
  onChange: (value: string) => void
  defaultValue?: string
  className?: string
}

export const SortSelect = ({
  onChange,
  defaultValue = 'recent',
  className = '',
}: SortSelectProps) => {
  return (
    <Select
      options={sortOptions}
      defaultValue={defaultValue}
      onChange={(e) => onChange(e.target.value)}
      className={`max-w-[200px] ${className} text-xs py-1 px-1`}
      label="Sort By"
      labelClassName="text-xs"
    />
  )
}
