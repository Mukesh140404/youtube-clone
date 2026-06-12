// import { useRef } from "react";
import VideoCardSkeleton from "../VideoCardSkeleton";
import { useQuery } from "@tanstack/react-query";
import { getUserAllVideoApi } from "@/client/video.api";
import type { Video } from "@/types/video.type";
import UserVideo from "./UserVideo";

const VideoSection = ({ userId }: { userId: string }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["userVideos", userId], // unique key
    queryFn: () => getUserAllVideoApi(userId),
    enabled: !!userId,
  });

  if (isError) {
    return <div className="text-center py-10 opacity-50">Failed to load videos.</div>;
  }

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-10">
          {Array.from({ length: 15 }).map((_, i) => (
            <VideoCardSkeleton key={i} />
          ))}
        </div>
      ) : !data || !data.videos || data.videos.length === 0 ? (
        <div className="text-center py-10 opacity-50">
          <p>No videos available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-10">
          {data.videos.map((video: Video) => (
            <UserVideo key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoSection;
