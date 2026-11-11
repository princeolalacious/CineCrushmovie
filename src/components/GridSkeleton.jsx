// Grey placeholder cards shown while movies are loading.
function GridSkeleton({ count = 12 }) {
  return (
    <div role="status" aria-label="Loading movies" className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse overflow-hidden rounded-xl bg-surface-2">
          <div className="aspect-2/3 bg-surface-3" />
          <div className="space-y-2 p-3">
            <div className="h-3 w-3/4 rounded bg-surface-3" />
            <div className="h-3 w-1/2 rounded bg-surface-3" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default GridSkeleton
