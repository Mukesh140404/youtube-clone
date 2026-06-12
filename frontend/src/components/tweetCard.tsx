import { useEffect, useRef, useState } from "react";
import {
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Trash2,
  Pencil,
  Clock,
  ThumbsUp,
} from "lucide-react";
import type { TweetProps } from "@/types/tweet.type";
import DeleteModal from "./modal/DeleteModal";
import { useUserStore } from "@/store/useUserStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTweetApi, updateTweetApi } from "@/client/tweet.api";
import { toggleLikeOnTweetApi } from "@/client/like.api";

const TweetCard = ({ tweet }: { tweet: TweetProps }) => {
  const [openActionMenu, setOpenActionMenu] = useState(false);
  const queryClient = useQueryClient();

  const [showActionButton, setShowActionButton] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(tweet.content);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(tweet.isLiked || false);
  const [likeCount, setLikeCount] = useState(tweet.likeCount || 0);

  const menuRef = useRef<HTMLDivElement>(null);

  const user = useUserStore((state) => state.user);

  const date = new Date(tweet.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  useEffect(() => {
    setIsLiked(tweet.isLiked || false);
    setLikeCount(tweet.likeCount || 0);
  }, [tweet]);

  const deleteMutation = useMutation({
    mutationFn: deleteTweetApi,

    onSuccess: (deletedUser) => {
      // cache update / refetch
      console.log(deletedUser)
      queryClient.invalidateQueries({
        queryKey: ["usertweets", tweet.owner._id],
      });
      queryClient.invalidateQueries({
        queryKey: ["allTweets"],
      });
    },

    onError: (err) => {
      console.log(err);
    },
  });
  
  const updateMutation = useMutation({
    mutationFn: updateTweetApi,

    onSuccess: (updatedUser) => {
      console.log(updatedUser)
      // cache update / refetch
      queryClient.invalidateQueries({
        queryKey: ["usertweets", tweet.owner._id],
      });
      queryClient.invalidateQueries({
        queryKey: ["allTweets"],
      });
    },

    onError: (err) => {
      console.log(err);
    },
  });

  const toggleLikeMutation = useMutation({
    mutationFn: toggleLikeOnTweetApi,
    onSuccess: () => {},
    onError: (err) => {
      setIsLiked((prev) => !prev);
      setLikeCount((prev) => isLiked ? prev + 1 : prev - 1);
      console.log(err);
    },
  });

  // Handle Modal Response
  const handleDeleteConfirm = (confirm: boolean) => {
    setIsDeleteModalOpen(false);
    if (confirm) {
      deleteMutation.mutate(tweet._id);
    }
    // if (confirm) onDelete(tweet._id);
  };

  const handleUpdate = () => {
    // onUpdate(tweet._id, editContent);
    updateMutation.mutate({
      _id: tweet._id,
      content: editContent,
    });
    setIsEditing(false);
    setOpenActionMenu(false);
  };

  const handleLike = () => {
    setIsLiked((prev) => !prev);
    setLikeCount((prev) => !isLiked ? prev + 1 : prev - 1);
    toggleLikeMutation.mutate(tweet._id);
  };

  useEffect(() => {
    setShowActionButton(tweet.owner._id === user?._id);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Agar menu khula hai aur click menu ke andar nahi hua hai
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenActionMenu(false);
      }
    };

    if (openActionMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openActionMenu]);

  return (
    <div className="relative p-5 flex flex-col h-full hover:bg-gray-50/50 dark:hover:bg-[#161616]/50 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={tweet.owner.avatar}
            className="w-11 h-11 rounded-full object-cover shrink-0"
            alt="avatar"
          />
          <div className="flex flex-col min-w-0">
            <span className="font-bold truncate dark:text-white text-[15px]">
              {tweet.owner.username}
            </span>
            <span className="text-[#606060] dark:text-[#aaaaaa] text-xs">
              {date}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#272727] rounded-full transition text-[#606060] dark:text-[#aaaaaa]"
            title="Details"
          >
            {showDetails ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {showActionButton && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setOpenActionMenu(!openActionMenu)}
                className="text-[#606060] dark:text-[#aaaaaa] hover:text-blue-500 p-1.5 rounded-full transition"
              >
                <MoreHorizontal size={18} />
              </button>

              {openActionMenu && (
                <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-[#0f0f0f] border border-gray-200 dark:border-[#3f3f3f] rounded-xl shadow-xl z-20 overflow-hidden">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setOpenActionMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-[#272727] transition text-left"
                  >
                    <Pencil size={16} /> Update Tweet
                  </button>
                  <button
                    onClick={() => {
                      setIsDeleteModalOpen(true);
                      setOpenActionMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition text-left"
                  >
                    <Trash2 size={16} /> Delete Tweet
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showDetails && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-[#272727]/30 rounded-xl text-xs text-[#606060] dark:text-[#aaaaaa] space-y-1.5">
          <div className="flex items-center gap-2">
            <Clock size={12} /> Created:{" "}
            {new Date(tweet.createdAt).toLocaleString()}
          </div>
          <div className="flex items-center gap-2">
            <Clock size={12} /> Updated:{" "}
            {new Date(tweet.updatedAt).toLocaleString()}
          </div>
        </div>
      )}

      <div className="flex-1">
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-3 bg-white dark:bg-[#0f0f0f] border border-blue-500 rounded-xl outline-none text-[15px] resize-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              rows={4}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm font-medium rounded-full hover:bg-gray-100 dark:hover:bg-[#272727] transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-full hover:bg-blue-700 transition shadow-sm"
              >
                Update
              </button>
            </div>
          </div>
        ) : (
          <p className="text-[15px] dark:text-[#f1f1f1] whitespace-pre-wrap break-words leading-relaxed">
            {tweet.content}
          </p>
        )}
      </div>

      {!isEditing && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-[#272727] flex items-center justify-between">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 -ml-3 rounded-full transition-colors ${isLiked ? 'text-blue-500 bg-blue-50 dark:bg-blue-500/10' : 'text-[#606060] dark:text-[#aaaaaa] hover:bg-gray-100 dark:hover:bg-[#272727]'}`}
          >
            <ThumbsUp size={18} className={isLiked ? "fill-current" : ""} />
            <span className="text-sm font-medium">{likeCount > 0 ? likeCount : ''} {isLiked ? 'Liked' : 'Like'}</span>
          </button>
        </div>
      )}

      <DeleteModal
        isOpen={isDeleteModalOpen}
        title="Delete Tweet?"
        description="This action cannot be undone. This will permanently delete your tweet from our servers."
        onClose={handleDeleteConfirm}
      />
    </div>
  );
};

export default TweetCard;
