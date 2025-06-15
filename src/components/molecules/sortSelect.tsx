'use client'

import { Select, SelectOption } from '@/components/atoms/select'

const postSortOptions: SelectOption[] = [
  { value: 'recent', label: 'Recent' },
  { value: 'popular', label: 'Popular' },
  { value: 'rated', label: 'Rating' },
]

const commentSortOptions: SelectOption[] = [
  { value: 'oldest', label: 'Oldest' },
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Popular' },
  { value: 'rated', label: 'Rating' },
]

interface SortSelectProps {
  onChange: (value: string) => void
  defaultValue?: string
  className?: string
  contentType?: 'post' | 'comment'
}

export const SortSelect = ({
  onChange,
  defaultValue = 'recent',
  className = '',
  contentType = 'post',
}: SortSelectProps) => {
  return (
    <Select
      id={`sort-${contentType}`}
      options={contentType === 'post' ? postSortOptions : commentSortOptions}
      defaultValue={defaultValue}
      onChange={(e) => onChange(e.target.value)}
      className={`max-w-[200px] ${className} px-1 py-1 text-xs`}
      label="Sort By"
      labelClassName="text-xs"
      aria-label={`Sort ${contentType} by`}
    />
  )
}
