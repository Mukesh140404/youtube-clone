
import VideoCardSkeleton from '@/components/VideoCardSkeleton';

// Reusing SidebarSkeleton from watchSkeleton for consistency
const SidebarSkeleton = () => (
  <div className="flex gap-2 animate-pulse">
    <div className="relative shrink-0 w-40 aspect-video rounded-lg overflow-hidden bg-gray-200 dark:bg-[#272727]" />
    <div className="flex-1 space-y-1">
      <div className="h-4 bg-gray-200 dark:bg-[#272727] rounded w-3/4 mb-1" />
      <div className="h-3 bg-gray-200 dark:bg-[#272727] rounded w-1/2" />
      <div className="h-3 bg-gray-200 dark:bg-[#272727] rounded w-2/3" />
    </div>
  </div>
);

export function HistoryPageSkeleton() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto animate-pulse">
      {/* Page Title Skeleton */}
      <div className="h-8 bg-gray-300 dark:bg-[#272727] rounded w-64 mb-8" />

      <div className="space-y-10">
        {/* Simulate a few date groups */}
        {[1, 2, 3].map((groupIndex) => (
          <div key={groupIndex}>
            {/* Date Group Header Skeleton */}
            <div className="h-6 bg-gray-300 dark:bg-[#272727] rounded w-48 mb-4 pb-2" />

            {/* Desktop / tablet grid skeleton */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8">
              {Array.from({ length: 3 }).map((_, i) => ( // 3 video cards
                <VideoCardSkeleton key={i} />
              ))}
            </div>

            {/* Mobile list skeleton */}
            <div className="md:hidden space-y-4">
              {Array.from({ length: 3 }).map((_, i) => ( // 3 sidebar video cards for mobile
                <SidebarSkeleton key={i} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}