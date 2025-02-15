'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { PostType } from '@/types/post'
import { deletePost } from '@/process/actions/postAction'
import { Button } from '@/common/components/button'

interface PostToolboxProps {
  post?: PostType
}

export default function PostToolbox({ post }: PostToolboxProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [isDeleting, setIsDeleting] = useState(false)

  if (!post || !session) return <></>

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return

    setIsDeleting(true)
    await deletePost({ id: post.id })
    router.push(`/${post.category.slug}`)
    setIsDeleting(false)
  }

  return (
    <div className="flex gap-2 justify-end mt-4">
      <Button
        linkPath={`/${post.category.slug}/${post.slug}/edit`}
        label="Edit"
        color="gray"
        leftIcon="edit"
        size="small"
      />
      <Button
        onClick={handleDelete}
        disabled={isDeleting}
        label={isDeleting ? 'Deleting...' : 'Delete'}
        color="danger"
        leftIcon="delete"
        size="small"
      />
    </div>
  )
}
