export const SidebarSkeleton = () => {
  return (
    <aside className="py-6 sidebar">
      <div className="p-6 h-full rounded-lg">
        <div className="animate-pulse">
          {/* Label skeleton */}
          <div className="h-6 w-full bg-border rounded mb-4" />

          {/* Posts skeleton */}
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-2 border-b border-border-secondary last:border-b-0"
            >
              {/* Category skeleton */}
              <div className="h-3 w-20 bg-border rounded mb-2" />

              {/* Title skeleton */}
              <div className="h-4 w-3/4 bg-border rounded mb-2" />

              {/* Info row skeleton */}
              <div className="flex gap-2 items-center">
                <div className="h-4 w-16 bg-border rounded" />
                <div className="h-4 w-12 bg-border rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
