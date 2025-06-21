'use client'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/atoms/button'

interface AddPostStickyProps {
  categorySlug?: string
}
export const AddPostSticky = ({ categorySlug }: AddPostStickyProps) => {
  const { data: session } = useSession()
  if (!session) return <></>

  return (
    <div className="fixed right-8 bottom-12 opacity-60">
      <Button
        linkPath={`/add/post?${categorySlug ? 'categorySlug=' + categorySlug : ''}`}
        leftIcon="add"
        size="large"
        boxStyle="box"
        title="Add Post"
      />
    </div>
  )
}
