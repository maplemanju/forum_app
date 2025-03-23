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
      options={contentType === 'post' ? postSortOptions : commentSortOptions}
      defaultValue={defaultValue}
      onChange={(e) => onChange(e.target.value)}
      className={`max-w-[200px] ${className} text-xs py-1 px-1`}
      label="Sort By"
      labelClassName="text-xs"
    />
  )
}
