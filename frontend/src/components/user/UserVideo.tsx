import { useNavigate } from "@tanstack/react-router";
import { MoreVertical, Trash2 } from "lucide-react";
import type { Video } from "@/types/video.type";
import { timeAgo } from "@/utils/timeAgo";
import { useRef, useState } from "react";
import DeleteModal from "../modal/DeleteModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteVideoApi } from "@/client/video.api";
import { useUserStore } from "@/store/useUserStore";
// import { getAllViewsForVideoApi } from "@/client/view.api";

export default function UserVideo({ video }: { video: Video }) {
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const [openActionMenu, setOpenActionMenu] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const user = useUserStore((state) => state.user)

  const DeleteVideoMutation = useMutation({
    mutationFn: deleteVideoApi,

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["userVideos", user?._id] });
      console.log(data);
    },
    onError: (err) => {
      console.log("MUTATION ERROR:", err);
    },
  });

  // const { data } = useQuery({
  //   queryKey: ["userVideos", user?._id],
  //   queryFn: () => getAllViewsForVideoApi(video._id),
  // })

  const handleDeleteConfirm = (confirm: boolean) => {
    setIsDeleteModalOpen(false);
    if (confirm) {
      DeleteVideoMutation.mutate(video._id);
    }
  };

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
      className="flex flex-col gap-3 group cursor-pointer w-full"
    >
      {/* Thumbnail */}
      <div
        onClick={handleClick}
        className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-200 dark:bg-[#272727]">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
        />
        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs font-medium px-1.5 py-0.5 rounded">
          {video.duration.toFixed(2)}
        </div>
      </div>

      {/* Details */}
      <div className="flex gap-3 pr-2 justify-between">
        {/* Video Info */}
        <div className="flex flex-col overflow-hidden" onClick={handleClick}>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 leading-tight mb-1 group-hover:text-blue-600 dark:group-hover:text-[#3ea6ff] transition-colors">
            {video.title}
          </h3>

          <div className="text-xs text-gray-500 dark:text-[#aaaaaa] flex items-center">
            <span>{video.views} views</span>
            <span className="mx-1 text-[10px]">•</span>
            <span>{timeAgo(video.createdAt)}</span>
          </div>
        </div>
        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenActionMenu(!openActionMenu);
            }}
            className="text-[#606060] dark:text-[#aaaaaa] hover:text-blue-500 p-1 rounded-full"
          >
            <MoreVertical size={18} />
          </button>

          {openActionMenu && (
            <div className="absolute -top-2 right-0 mt-2 w-48 bg-white dark:bg-[#0f0f0f] border border-gray-200 dark:border-[#3f3f3f] rounded-xl shadow-xl z-10 overflow-hidden">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDeleteModalOpen(true);
                  setOpenActionMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition text-left"
              >
                <Trash2 size={16} /> Delete video
              </button>
            </div>
          )}
        </div>
      </div>
      <DeleteModal
        isOpen={isDeleteModalOpen}
        title="Delete video?"
        description="This action cannot be undone. This will permanently delete your video from our servers."
        onClose={handleDeleteConfirm}
      />
    </div>
  );
}
