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
      {
        isError && (
          <div> error in fetching videos </div>
        )
      }

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-10">
        {isLoading
          ? Array.from({ length: 15 }).map((_, i) => <VideoCardSkeleton key={i} />)
          : data.videos.length > 0 ? data.videos.map((video: Video) => <VideoCard key={video._id} video={video} />) : <>no videos found</>
        }
      </div>
    </div>
  );
}
