export default function VideoCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 w-full animate-pulse">
      {/* Thumbnail Skeleton */}
      <div className="w-full aspect-video rounded-xl bg-gray-200 dark:bg-[#272727]"></div>

      {/* Details Skeleton */}
      <div className="flex gap-3 pr-6">
        {/* Channel Avatar Skeleton */}
        <div className="flex-shrink-0 mt-1">
          <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-[#272727]"></div>
        </div>

        {/* Video Info Skeleton */}
        <div className="flex flex-col w-full gap-2 mt-1">
          {/* Title line 1 */}
          <div className="h-4 bg-gray-200 dark:bg-[#272727] rounded w-[90%]"></div>
          {/* Title line 2 */}
          <div className="h-4 bg-gray-200 dark:bg-[#272727] rounded w-[60%]"></div>
          
          {/* Channel Name & Meta */}
          <div className="h-3 bg-gray-200 dark:bg-[#272727] rounded w-[50%] mt-1"></div>
          <div className="h-3 bg-gray-200 dark:bg-[#272727] rounded w-[40%]"></div>
        </div>
      </div>
    </div>
  );
}
