export const EditorSkeleton = ({ size = 'sm' }: { size?: 'sm' | 'lg' }) => {
  return (
    <div
      className="rounded-lg bg-border animate-pulse"
      style={{ height: size === 'sm' ? '204px' : '544px' }}
    ></div>
  )
}
