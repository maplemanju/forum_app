'use client'

import { useRouter } from 'next/navigation'
import { useActionState } from 'react'
import { Button } from '@/components/atoms/button'

export default function SearchBox({ tags }: { tags?: string[] }) {
  const router = useRouter()

  const handleSearch = (prev: string, formData: FormData) => {
    const searchTerm = formData.get('query')?.toString()
    if (searchTerm) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`)
    } else {
      router.push('/search')
    }
    return searchTerm || ''
  }

  const [keyword, formAction] = useActionState(handleSearch, '')

  return (
    <form action={formAction} className="flex gap-2 p-4">
      <input
        name="query"
        defaultValue={keyword}
        placeholder="Search..."
        list="tag-suggestions"
        className="px-4 py-2 bg-background border rounded-lg flex-grow border-border focus:ring-border focus:ring-2"
      />
      <datalist id="tag-suggestions">
        {tags?.map((tag) => (
          <option value={`#${tag}`} key={tag} />
        ))}
      </datalist>
      <Button type="submit" label="Search" color="primary" leftIcon="search" />
    </form>
  )
}
