import { ThumbsUp, ThumbsDown, Share2, MoreHorizontal } from "lucide-react";
import { ActionButton, CheckCircleIcon } from "@/components/watch/index";
import type { Owner } from "@/types/video.type";
import { timeAgo } from "@/utils/timeAgo";
import { Link } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleLikeOnVideoApi } from "@/client/like.api";
import { toggleSubscribeChannelBtn } from "@/client/subscription.api";
import { useState, useEffect } from "react";
import { useUserStore } from '@/store/useUserStore'

export interface Video {
  _id: string;
  videoFile: string;
  thumbnail: string;
  title: string;
  description: string;
  duration: number;
  views: number;
  owner: Owner;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  commentCount: number;
  subscriberCount: number;
  isSubscribed?: boolean;
  isLiked?: boolean;
}

const VideoDetails = ({ data }: { data: Video }) => {
  const queryClient = useQueryClient()
  const [isLiked, setIsLiked] = useState(data.isLiked || false)
  const [likeCount, setLikeCount] = useState(data.likeCount || 0)
  const [isSubscribed, setIsSubscribed] = useState(data.isSubscribed || false)
  const [subscriberCount, setSubscriberCount] = useState(data.subscriberCount || 0)
  
  const username = useUserStore((state) => state.user?.username)
  
  useEffect(() => {
    setIsSubscribed(data.isSubscribed || false);
    setSubscriberCount(data.subscriberCount || 0);
    setLikeCount(data.likeCount || 0);
    setIsLiked(data.isLiked || false);
  }, [data]);

  const likeMutation = useMutation({
    mutationFn: toggleLikeOnVideoApi,
    onSuccess: (resData) => {
      console.log(resData)
      queryClient.invalidateQueries({ queryKey: ["video"] })
    },
    onError: (err) => {
      console.error(err)
      setIsLiked((prev) => !prev)
      setLikeCount((prev) => isLiked ? prev + 1 : prev - 1)
    }
  })

  const subscribeMutation = useMutation({
    mutationFn: toggleSubscribeChannelBtn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["video"] })
    },
    onError: (err) => {
      console.error(err)
      setIsSubscribed((prev) => !prev)
      setSubscriberCount((prev) => isSubscribed ? prev + 1 : prev - 1)
    }
  })

  const handleToggleLike = () => {
    setIsLiked((prev) => !prev)
    setLikeCount((prev) => !isLiked ? prev + 1 : prev - 1)
    likeMutation.mutate(data._id)
  }

  const handleToggleSubscribe = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsSubscribed((prev) => !prev)
    setSubscriberCount((prev) => isSubscribed ? prev - 1 : prev + 1)
    subscribeMutation.mutate(data.owner._id)
  }

  return (
    <div className="mt-4 space-y-4">
      <h1 className="text-xl font-bold line-clamp-2 leading-tight">
        {data.title}
      </h1>

      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Channel Info */}
        <Link to="/$userId"
          params={{ userId: data.owner.username! }} className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-full object-cover overflow-hidden">
            <img src={data.owner.avatar || "/user.png"} alt="avatar" />
          </div>
          <div>
            <h3 className="font-bold text-md flex items-center gap-1">
              {data.owner.username} <CheckCircleIcon />
            </h3>
            <p className="text-xs text-gray-500 dark:text-[#aaaaaa]">
              {subscriberCount} subscribers
            </p>
          </div>
          {username && data?.owner?.username && username !== data.owner.username && (
            <button 
              onClick={handleToggleSubscribe}
              className={`ml-4 px-4 py-2 rounded-full text-sm font-medium transition ${isSubscribed ? 'bg-gray-200 text-black hover:bg-gray-300 dark:bg-[#3f3f3f] dark:text-white dark:hover:bg-[#4f4f4f]' : 'bg-black text-white hover:opacity-90 dark:bg-white dark:text-black'}`}
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          )}
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center bg-gray-100 dark:bg-[#272727] rounded-full">
            <button className={`flex items-center gap-2 px-4 py-2 hover:bg-gray-200 dark:hover:bg-[#3f3f3f] border-r border-gray-300 dark:border-[#444] rounded-l-full ${isLiked ? 'text-blue-500' : ''}`}
              onClick={handleToggleLike}
            >
              <ThumbsUp size={18} className={isLiked ? "fill-current" : ""} />{" "}
              <span className="text-sm font-medium">{likeCount}</span>
            </button>
            <button className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-[#3f3f3f] rounded-r-full">
              <ThumbsDown size={18} />
            </button>
          </div>
          <ActionButton icon={<Share2 size={18} />} label="Share" />
          <ActionButton icon={<MoreHorizontal size={18} />} label="" />
        </div>
      </div>

      {/* Description Box */}
      <div className="bg-gray-100 dark:bg-[#272727] p-3 rounded-xl text-sm hover:bg-gray-200 dark:hover:bg-[#3f3f3f] transition cursor-pointer">
        <div className="font-bold flex gap-2 mb-1">
          <span>{data.views} views</span>
          <span>{timeAgo(data.createdAt)}</span>
        </div>
        <p className="whitespace-pre-wrap">{data.description}</p>
        <button className="font-bold mt-2">...more</button>
      </div>
    </div>
  );
};

export default VideoDetails;