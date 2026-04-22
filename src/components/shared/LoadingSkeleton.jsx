export default function LoadingSkeleton({ count = 3 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card animate-pulse">
          <div className="flex items-start gap-4">
            <div className="skeleton w-12 h-12 rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-3/4 rounded" />
              <div className="skeleton h-3 w-1/2 rounded" />
            </div>
            <div className="skeleton h-6 w-20 rounded-full" />
          </div>
          <div className="mt-4 flex gap-3">
            <div className="skeleton h-3 w-24 rounded" />
            <div className="skeleton h-3 w-20 rounded" />
            <div className="skeleton h-3 w-16 rounded" />
          </div>
          <div className="mt-3 flex gap-2">
            {[1,2,3].map(j => <div key={j} className="skeleton h-6 w-16 rounded-lg" />)}
          </div>
        </div>
      ))}
    </div>
  )
}
