import { useState, useEffect, useCallback } from 'react'
import { ReplyType } from '@/types/comment'
import { getRepliesByCommentId } from '@/process/actions/commentAction'
import { useSearchParams } from 'next/navigation'
import { config } from '@/utils/config'

const REPLIES_PER_PAGE = Number(config.commentListPerPage)

export const useReplyLoadMore = ({ commentId }: { commentId: number }) => {
  const [replies, setReplies] = useState<ReplyType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const searchParams = useSearchParams()

  const handleLoadMore = useCallback(async () => {
    if (hasMore && !isLoading) {
      const isInitialLoad = (replyResponse: ReplyType[]) => {
        return (
          JSON.stringify(replies) === JSON.stringify(replyResponse) ||
          replies.length === 0
        )
      }

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
  }, [commentId, hasMore, isLoading, searchParams, replies])

  // Load initial replies when mounted
  useEffect(() => {
    if (!isInitialized && commentId) {
      setIsInitialized(true)
      handleLoadMore()
    }
  }, [commentId, isInitialized, handleLoadMore])

  return {
    replies,
    isLoading,
    hasMore,
    handleLoadMore,
  }
}
