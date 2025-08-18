export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Backdrop Skeleton */}
      <div className="relative h-96 md:h-[500px] overflow-hidden bg-gradient-to-b from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 animate-pulse">
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 relative -mt-32 z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Poster Skeleton */}
          <div className="flex-shrink-0">
            <div className="w-64 h-96 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse" />
          </div>

          {/* Movie Info Skeleton */}
          <div className="flex-1 space-y-6">
            {/* Title */}
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-3/4" />
            
            {/* Tagline */}
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-1/2" />
            
            {/* Rating and Meta */}
            <div className="flex flex-wrap gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-20" />
              ))}
            </div>
            
            {/* Overview */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-full" />
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-5/6" />
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-4/5" />
            </div>
            
            {/* Genres */}
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-6 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse w-16" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
