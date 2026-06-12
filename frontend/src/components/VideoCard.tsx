import { useNavigate } from "@tanstack/react-router";
import { MoreVertical } from "lucide-react";
import type { Video } from "@/types/video.type";
import { timeAgo } from "@/utils/timeAgo";

export default function VideoCard({ video }: { video: Video }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate({
      to: "/watch",
      search: {
        v: video._id, // 👈 query param
      },
    });
  };

  return (
    <div
      onClick={handleClick}
      className="flex flex-col gap-3 group cursor-pointer w-full"
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-200 dark:bg-[#272727]">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
        />
        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs font-medium px-1.5 py-0.5 rounded">
          {video.duration}
        </div>
      </div>

      {/* Details */}
      <div className="flex w-full justify-between">
        {/* Channel Avatar */}
        <div className="flex gap-3 pr-6">
        <div className="shrink-0 mt-1">
          <img
            src={video.owner.avatar}
            alt={video.owner.username}
            className="w-9 h-9 rounded-full object-cover border border-gray-100 dark:border-[#3f3f3f]"
          />
        </div>

        {/* Video Info */}
        <div className="flex flex-col overflow-hidden">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 leading-tight mb-1 group-hover:text-blue-600 dark:group-hover:text-[#3ea6ff] transition-colors">
            {video.title}
          </h3>

          <p className="text-xs text-gray-500 dark:text-[#aaaaaa]">
            {video.owner.username}
          </p>

          <div className="text-xs text-gray-500 dark:text-[#aaaaaa] flex items-center">
            <span>{video.views} views</span>
            <span className="mx-1 text-[10px]">•</span>
            <span>{timeAgo(video.createdAt)}</span>
          </div>
        </div></div>

        {/* React Icon (replace SVG) */}
        <button
          onClick={(e) => e.stopPropagation()} // 👈 important (card click na trigger ho)
          className="shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 h-fit rounded-full hover:bg-gray-100 dark:hover:bg-[#272727] text-gray-900 dark:text-white"
        >
          <MoreVertical size={20} />
        </button>
      </div>
    </div>
  );
}