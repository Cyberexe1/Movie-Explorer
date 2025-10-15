interface SkeletonProps {
  index?: number
}

export function MovieCardSkeleton({ index = 0 }: SkeletonProps) {
  return (
    <div 
      className="card overflow-hidden"
      style={{ 
        animationDelay: `${index * 100}ms`,
        animation: 'slideUp 0.6s ease-out forwards'
      }}
    >
      {/* Poster Skeleton */}
      <div className="aspect-[2/3] shimmer rounded-t-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
      </div>
      
      {/* Content Skeleton */}
      <div className="p-5 space-y-4">
        <div className="space-y-3">
          <div className="h-5 shimmer rounded-lg w-4/5"></div>
          <div className="h-4 shimmer rounded-lg w-3/5"></div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="h-3 shimmer rounded w-16"></div>
          <div className="h-3 shimmer rounded w-20"></div>
        </div>
        
        <div className="space-y-2">
          <div className="h-3 shimmer rounded"></div>
          <div className="h-3 shimmer rounded w-5/6"></div>
          <div className="h-3 shimmer rounded w-3/4"></div>
        </div>
        
        {/* Rating Bar Skeleton */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="h-2 shimmer rounded w-12"></div>
            <div className="h-2 shimmer rounded w-8"></div>
          </div>
          <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div className="h-1.5 shimmer rounded-full w-3/4"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function MovieGridSkeleton({ count = 20 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <MovieCardSkeleton key={index} index={index} />
      ))}
    </div>
  )
}

export function MovieDetailSkeleton() {
  return (
    <div className="fade-in">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Poster Skeleton */}
        <div className="w-full lg:w-80 aspect-[2/3] shimmer rounded-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
        </div>
        
        {/* Details Skeleton */}
        <div className="flex-1 space-y-8">
          {/* Title */}
          <div className="space-y-4">
            <div className="h-10 shimmer rounded-xl w-4/5"></div>
            <div className="h-6 shimmer rounded-lg w-3/5"></div>
          </div>
          
          {/* Meta Info */}
          <div className="flex flex-wrap gap-4">
            <div className="h-8 shimmer rounded-full w-20"></div>
            <div className="h-8 shimmer rounded-full w-16"></div>
            <div className="h-8 shimmer rounded-full w-24"></div>
          </div>
          
          {/* Genres */}
          <div className="flex flex-wrap gap-2">
            <div className="h-6 shimmer rounded-full w-16"></div>
            <div className="h-6 shimmer rounded-full w-20"></div>
            <div className="h-6 shimmer rounded-full w-18"></div>
          </div>
          
          {/* Overview */}
          <div className="space-y-3">
            <div className="h-6 shimmer rounded-lg w-32"></div>
            <div className="space-y-2">
              <div className="h-4 shimmer rounded"></div>
              <div className="h-4 shimmer rounded"></div>
              <div className="h-4 shimmer rounded w-5/6"></div>
              <div className="h-4 shimmer rounded w-4/5"></div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-4">
            <div className="h-12 shimmer rounded-xl w-48"></div>
            <div className="h-12 shimmer rounded-xl w-32"></div>
          </div>
        </div>
      </div>
      
      {/* Additional Details Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="card p-6 space-y-4">
            <div className="h-6 shimmer rounded-lg w-3/4"></div>
            <div className="space-y-3">
              <div className="h-4 shimmer rounded w-full"></div>
              <div className="h-4 shimmer rounded w-5/6"></div>
              <div className="h-4 shimmer rounded w-4/5"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function SearchSkeleton() {
  return (
    <div className="space-y-8 fade-in">
      {/* Header Skeleton */}
      <div className="space-y-4">
        <div className="h-8 shimmer rounded-xl w-64"></div>
        <div className="h-4 shimmer rounded-lg w-96"></div>
      </div>
      
      {/* Grid Skeleton */}
      <MovieGridSkeleton count={15} />
    </div>
  )
}

export function FavoritesSkeleton() {
  return (
    <div className="space-y-8 fade-in">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 shimmer rounded-xl w-48"></div>
          <div className="h-4 shimmer rounded-lg w-64"></div>
        </div>
        <div className="h-10 shimmer rounded-xl w-24"></div>
      </div>
      
      {/* Grid Skeleton */}
      <MovieGridSkeleton count={12} />
      
      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="card p-6 text-center space-y-3">
            <div className="h-8 shimmer rounded-lg w-16 mx-auto"></div>
            <div className="h-4 shimmer rounded w-24 mx-auto"></div>
          </div>
        ))}
      </div>
    </div>
  )
}