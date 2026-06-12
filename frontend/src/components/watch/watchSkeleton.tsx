// import React from "react";

// --- Single Sidebar Card Skeleton ---
const SidebarSkeleton = () => (
  <div className="flex gap-2 animate-pulse">
    <div className="shrink-0 w-40 aspect-video rounded-lg bg-gray-200 dark:bg-[#272727]" />
    <div className="flex-1 space-y-2 py-1">
      <div className="h-4 bg-gray-200 dark:bg-[#272727] rounded w-full" />
      <div className="h-3 bg-gray-200 dark:bg-[#272727] rounded w-3/4" />
      <div className="h-3 bg-gray-200 dark:bg-[#272727] rounded w-1/2" />
    </div>
  </div>
);

// --- Video Player & Details Skeleton ---
const MainContentSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    {/* Player */}
    <div className="w-full aspect-video bg-gray-200 dark:bg-[#272727] rounded-xl" />
    
    {/* Title */}
    <div className="space-y-3">
      <div className="h-6 bg-gray-200 dark:bg-[#272727] rounded w-3/4" />
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-[#272727]" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-[#272727] rounded w-24" />
            <div className="h-3 bg-gray-200 dark:bg-[#272727] rounded w-16" />
          </div>
        </div>
        <div className="h-10 bg-gray-200 dark:bg-[#272727] rounded-full w-28" />
      </div>
    </div>

    {/* Description Box */}
    <div className="h-24 bg-gray-100 dark:bg-[#272727] rounded-xl w-full" />
  </div>
);

// --- Full Page Skeleton Wrapper ---
export const WatchPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0f0f0f] px-4 py-4 md:px-6 lg:px-12">
      <div className="max-w-425 mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-8">
          <MainContentSkeleton />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-4">
          {/* Category Chips Skeleton */}
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 w-20 bg-gray-200 dark:bg-[#272727] rounded-lg shrink-0" />
            ))}
          </div>
          
          {/* Sidebar Cards */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SidebarSkeleton key={i} />
          ))}
        </div>

      </div>
    </div>
  );
};