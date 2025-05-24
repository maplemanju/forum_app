import { useState, useEffect, useRef } from 'react'
import { PostType } from '@/types/post'
import {
  getPostsByCategory,
  getPostsByKeyword,
  getRecentlyUpdatedPosts,
} from '@/process/actions/postAction'
import { ResponseType } from '@/utils/errors'

const POSTS_PER_PAGE = 5

export const useInfinitePostScroll = ({
  initialPosts,
  observerTarget,
  typeOfList,
  categoryId,
  keywords,
}: {
  initialPosts: PostType[]
  observerTarget: React.RefObject<HTMLDivElement | null>
  typeOfList: 'recent' | 'category' | 'keyword'
  categoryId?: number | null
  keywords?: string[] | null
}) => {
  const [posts, setPosts] = useState<PostType[]>(initialPosts)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const prevInitialPostsRef = useRef<PostType[]>(initialPosts)

  // Update posts when initialPosts changes (new search)
  useEffect(() => {
    // Only update if initialPosts actually changed
    if (
      JSON.stringify(prevInitialPostsRef.current) !==
      JSON.stringify(initialPosts)
    ) {
      setPosts(initialPosts)
      prevInitialPostsRef.current = initialPosts
      setHasMore(true) // Reset hasMore when new search is performed
    }
  }, [initialPosts])

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setIsLoading(true)
          try {
            let response: ResponseType<PostType[]>
            if (typeOfList === 'category' && categoryId) {
              response = await getPostsByCategory({
                take: POSTS_PER_PAGE,
                skip: posts.length,
                categoryId: categoryId,
              })
            } else if (typeOfList === 'keyword' && keywords) {
              response = await getPostsByKeyword({
                take: POSTS_PER_PAGE,
                skip: posts.length,
                keyword: keywords,
              })
            } else {
              response = await getRecentlyUpdatedPosts({
                take: POSTS_PER_PAGE,
                skip: posts.length,
              })
            }
            const postsData = response.data
            if (response.success && postsData) {
              if (postsData.length < POSTS_PER_PAGE) {
                setHasMore(false)
              }
              setPosts((prev) => [...prev, ...postsData])
            }
          } catch (error) {
            console.error('Error loading more posts:', error)
          } finally {
            setIsLoading(false)
          }
        }
      },
      { threshold: 1.0 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [
    posts.length,
    hasMore,
    isLoading,
    observerTarget,
    categoryId,
    typeOfList,
    keywords,
  ])

  return {
    posts,
    isLoading,
    hasMore,
  }
}
