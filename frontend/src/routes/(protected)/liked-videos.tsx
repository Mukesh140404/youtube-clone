import { getAllLikedVideoOfUserApi } from '@/client/like.api';
import VideoCard from '@/components/VideoCard';
import VideoCardSkeleton from '@/components/VideoCardSkeleton';
import type { Video } from '@/types/video.type';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/liked-videos')({
    component: RouteComponent,
})

interface LikedVideo {
    _id: string;
    video: Video;
    createdAt: string;
    updatedAt: string;
}

function RouteComponent() {
    const {data, isLoading, isError } = useQuery({
        queryKey: ["liked-videos"],
        queryFn: getAllLikedVideoOfUserApi,
    });
    console.log(data)
    return (
        <div className="p-4 md:p-6 w-full max-w-500 mx-auto">
            <div>
                <h1 className="text-2xl font-bold mb-6 dark:text-white">Liked Videos</h1>
            </div>
            {
                isError && (
                    <div> error in fetching videos </div>
                )
            }

            {/* Video Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-10">
                {isLoading
                    ? Array.from({ length: 15 }).map((_, i) => <VideoCardSkeleton key={i} />)
                    : data.data.length > 0 ? data.data.map((video: LikedVideo) => <VideoCard key={video._id} video={video.video} />) : <>no videos found</>
                }
            </div>
        </div>
    )
}
