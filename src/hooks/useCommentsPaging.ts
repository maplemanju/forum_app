import { useState, useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const COMMENTS_PER_PAGE = Number(process.env.NEXT_PUBLIC_COMMENT_LIST_PER_PAGE)

type NavigationType = 'previous' | 'next' | 'oldest' | 'latest'

export const useCommentsPaging = ({
  commentCount,
}: {
  commentCount: number
}) => {
  const [hasMoreOld, setHasMoreOld] = useState(false)
  const [hasMoreNew, setHasMoreNew] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const totalPages = Math.ceil(commentCount / COMMENTS_PER_PAGE)
  const currentPage = Number(searchParams.get('page') || '0')

  useEffect(() => {
    // Check if there are older comments
    setHasMoreOld(currentPage < totalPages - 1)
    // Check if there are newer comments
    setHasMoreNew(currentPage > 0)
  }, [totalPages, currentPage])

  const handleLoadMore = async (type: NavigationType) => {
    let newPage: number

    switch (type) {
      case 'previous':
        if (!hasMoreOld) return
        newPage = currentPage + 1
        break
      case 'next':
        if (!hasMoreNew) return
        newPage = currentPage - 1
        break
      case 'oldest':
        newPage = totalPages - 1
        break
      case 'latest':
        newPage = 0
        break
      default:
        newPage = currentPage
    }

    // Update URL with new page
    const newParams = new URLSearchParams(searchParams)
    newParams.set('page', newPage.toString())
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false })
  }

  return {
    hasMoreOld,
    hasMoreNew,
    handleLoadMore,
    currentPage,
    totalPages,
  }
}
