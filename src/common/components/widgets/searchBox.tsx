'use client'

import { useRouter } from 'next/navigation'
import { useActionState } from 'react'

export default function SearchBox({ tags }: { tags?: string[] }) {
  const router = useRouter()

  const handleSearch = (prev: string, formData: FormData) => {
    console.log('handleSearch', formData)
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
    <form action={formAction} className="flex gap-2">
      <input
        name="query"
        defaultValue={keyword}
        placeholder="Search..."
        list="tag-suggestions"
        className="px-4 py-2 border rounded-lg flex-grow bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
      />
      <datalist id="tag-suggestions">
        {tags?.map((tag) => (
          <option value={`#${tag}`} key={tag} />
        ))}
      </datalist>
      <button
        type="submit"
        className="px-6 py-2 bg-blue-500  dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700"
      >
        Search
      </button>
    </form>
  )
}
