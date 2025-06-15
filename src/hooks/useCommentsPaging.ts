import { useState, useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { config } from '@/utils/config'

const COMMENTS_PER_PAGE = Number(config.commentListPerPage)

type NavigationType = 'previous' | 'next' | 'first' | 'last'

export const useCommentsPaging = ({
  commentCount,
}: {
  commentCount: number
}) => {
  const [hasMorePrevious, setHasMorePrevious] = useState(false)
  const [hasMoreNext, setHasMoreNext] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const totalPages = Math.ceil(commentCount / COMMENTS_PER_PAGE)
  const currentPage = Number(searchParams.get('page') || '0')

  useEffect(() => {
    // Check if there are older comments
    setHasMorePrevious(currentPage > 0)
    // Check if there are newer comments
    setHasMoreNext(currentPage < totalPages - 1)
  }, [totalPages, currentPage])

  const handleLoadMore = async (type: NavigationType) => {
    let newPage: number

    switch (type) {
      case 'next':
        if (!hasMoreNext) return
        newPage = currentPage + 1
        break
      case 'previous':
        if (!hasMorePrevious) return
        newPage = currentPage - 1
        break
      case 'last':
        newPage = totalPages - 1
        break
      case 'first':
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
    hasMorePrevious,
    hasMoreNext,
    handleLoadMore,
    currentPage,
    totalPages,
  }
}
