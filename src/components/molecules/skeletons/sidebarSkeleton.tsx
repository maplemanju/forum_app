'use client'

export const SidebarSkeleton = () => {
  return (
    <aside className="sidebar py-6">
      <div className="h-full rounded-lg p-6">
        <div className="animate-pulse">
          {/* Label skeleton */}
          <div className="bg-border mb-4 h-6 w-full rounded" />

          {/* Posts skeleton */}
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border-border-secondary border-b p-2 last:border-b-0"
            >
              {/* Category skeleton */}
              <div className="bg-border mb-2 h-3 w-20 rounded" />

              {/* Title skeleton */}
              <div className="bg-border mb-2 h-4 w-3/4 rounded" />

              {/* Info row skeleton */}
              <div className="flex items-center gap-2">
                <div className="bg-border h-4 w-16 rounded" />
                <div className="bg-border h-4 w-12 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
