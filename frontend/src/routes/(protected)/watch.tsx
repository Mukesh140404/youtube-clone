import { createFileRoute, useSearch } from "@tanstack/react-router";
import {
  SidebarVideoCard,
  VideoDetails,
  VideoPlayer,
  CommentsSection,
} from "@/components/watch/index";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/store/useUserStore";
import { getVideoApi, getAllVideoApi } from "@/client/video.api";
import { WatchPageSkeleton } from "@/components/watch/watchSkeleton";
import type { Video } from "@/types/video.type";

export const Route = createFileRoute("/(protected)/watch")({
  validateSearch: (search) => {
    return {
      v: typeof search.v === "string" ? search.v : "",
    };
  },
  component: YouTubeWatchPage,
});


function YouTubeWatchPage() {
  const { v } = useSearch({ from: "/(protected)/watch" });
  const userId = useUserStore((state) => state.user?._id);

  const {
    data: videoInfo,
    isLoading
  } = useQuery({
    queryKey: ["Videos", userId, v],
    queryFn: () => getVideoApi(v),
  });

  const { data: allVideosData } = useQuery({
    queryKey: ["videos"],
    queryFn: getAllVideoApi,
  });

  const suggestedVideos = allVideosData?.videos?.filter((video: Video) => video._id !== v) || [];

  if (isLoading) {
    return <WatchPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f0f0f] text-gray-900 dark:text-white px-4 py-4 md:px-6 lg:px-12">
      <div className="max-w-425 mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Player & Comments (8/12 space) */}
        <div className="lg:col-span-8 space-y-6">
          <VideoPlayer
            videoId={videoInfo._id}
            videoUrl={videoInfo.videoFile}
            thumbnail={videoInfo.thumbnail}
          />
          <VideoDetails data={videoInfo} />

          {/* Comments Summary Section */}
          <CommentsSection
            video={videoInfo}
          />
        </div>

        {/* RIGHT COLUMN: Sidebar (4/12 space) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="space-y-4">
            {suggestedVideos.map((video: Video) => (
              <SidebarVideoCard key={video._id} video={video} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
