'use client'

export const EditorSkeleton = ({ size = 'sm' }: { size?: 'sm' | 'lg' }) => {
  return (
    <div
      className="bg-border animate-pulse rounded-lg"
      style={{ height: size === 'sm' ? '204px' : '544px' }}
    ></div>
  )
}
