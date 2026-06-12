import { createFileRoute } from '@tanstack/react-router';
// import { useState, useEffect } from 'react';
import VideoCard from '@/components/VideoCard';
import VideoCardSkeleton from '@/components/VideoCardSkeleton';
import type { Video } from '@/types/video.type';
import { useQuery } from "@tanstack/react-query";
import { getAllVideoApi } from '@/client/video.api';

export const Route = createFileRoute('/(protected)/')({
  component: RouteComponent,
});

function RouteComponent() {

const { data, isLoading, isError } = useQuery({
    queryKey: ["videos"],
    queryFn: getAllVideoApi,
  });

  return (
    <div className="p-4 md:p-6 w-full max-w-500 mx-auto">
      {/* Category Pills (Optional extra feature often seen on YouTube home page) */}
      {/* <div className="flex gap-3 mb-6 overflow-x-auto pb-2 custom-scrollbar hide-scrollbar-arrows sticky top-0 bg-gray-50 dark:bg-[#0f0f0f] z-10 py-2">
        {['All', 'Mixes', 'Music', 'Live', 'Computer programming', 'Gaming', 'News', 'Recent'].map((cat, i) => (
          <button 
            key={i} 
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              i === 0 
                ? 'bg-black text-white dark:bg-white dark:text-black' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-[#272727] dark:hover:bg-[#3f3f3f] dark:text-[#f1f1f1]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div> */}
      {
        isError && (
          <div> error in fetching videos </div>
        )
      }

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-10">
        {isLoading 
          ? Array.from({ length: 15 }).map((_, i) => <VideoCardSkeleton key={i} />)
          : data.videos.length > 0  ? data.videos.map((video:Video) => <VideoCard key={video._id} video={video} />) : <>no videos found</>
        }
      </div>
    </div>
  );
}
