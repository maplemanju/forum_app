import { useState, useEffect } from 'react'
import { ReplyType } from '@/types/comment'
import { getRepliesByCommentId } from '@/process/actions/commentAction'
import { useSearchParams } from 'next/navigation'

const REPLIES_PER_PAGE = Number(process.env.NEXT_PUBLIC_COMMENT_LIST_PER_PAGE)

export const useReplyLoadMore = ({ commentId }: { commentId: number }) => {
  const [replies, setReplies] = useState<ReplyType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const searchParams = useSearchParams()

  const handleLoadMore = async () => {
    if (hasMore && !isLoading) {
      setIsLoading(true)
      console.log('loading more replies')
      const sort = searchParams.get('sort') as
        | 'oldest'
        | 'newest'
        | 'popular'
        | 'rated'

      const response = await getRepliesByCommentId({
        take: REPLIES_PER_PAGE,
        skip: replies.length,
        commentId: commentId,
        sort: sort,
      })
      const repliesData = response.data
      if (response.success && repliesData) {
        if (repliesData.length < REPLIES_PER_PAGE) {
          setHasMore(false)
        }
        if (isInitialLoad(repliesData)) {
          setReplies(repliesData)
        } else {
          setReplies((prev) => [...prev, ...repliesData])
        }
      }
      setIsLoading(false)
    }
  }

  const isInitialLoad = (replyResponse: ReplyType[]) => {
    return (
      JSON.stringify(replies) === JSON.stringify(replyResponse) ||
      replies.length === 0
    )
  }

  // Load initial replies when mounted
  useEffect(() => {
    if (!isInitialized && commentId) {
      setIsInitialized(true)
      handleLoadMore()
    }
  }, [commentId, isInitialized])

  return {
    replies,
    isLoading,
    hasMore,
    handleLoadMore,
  }
}
