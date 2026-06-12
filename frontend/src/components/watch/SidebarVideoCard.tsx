import type { Video } from "@/types/video.type";
import { Link } from "@tanstack/react-router";
import { timeAgo } from "@/utils/timeAgo";

const SidebarVideoCard = ({ video }: { video: Video }) => (
  <Link to="/watch" search={{ v: video._id }} className="flex gap-2 group cursor-pointer">
    <div className="relative shrink-0 w-40 aspect-video rounded-lg overflow-hidden bg-gray-200 dark:bg-[#272727]">
        <img src={video.thumbnail} className="w-full h-full object-cover" alt="thumbnail" />
        <span className="absolute bottom-1 right-1 bg-black text-white text-[10px] px-1 rounded">
          {Math.floor(video.duration / 60)}:{(Math.floor(video.duration % 60)).toString().padStart(2, '0')}
        </span>
    </div>
    <div className="flex-1 space-y-1">
      <h4 className="text-sm font-bold line-clamp-2 leading-snug">{video.title}</h4>
      <p className="text-xs text-gray-500 dark:text-[#aaaaaa]">{video.owner?.username}</p>
      <p className="text-xs text-gray-500 dark:text-[#aaaaaa]">{video.views} views • {timeAgo(video.createdAt)}</p>
    </div>
  </Link>
);

export default SidebarVideoCard;