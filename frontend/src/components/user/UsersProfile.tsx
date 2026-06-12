import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleSubscribeChannelBtn } from '@/client/subscription.api';
import VideoSection from './VideoSection';
import CommunitySection from './CommunitySection';
import PlaylistSection from './PlaylistSection';
// import VideoCard from "@/components/VideoCard";
// import VideoCardSkeleton from "@/components/VideoCardSkeleton";
// import type {Video} from "@/types/video.type"


export type ChannelProfile = {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  coverImage: string;
  subscribersCount: number;
  channelSubscribedToCount: number;
  isSubscribed: boolean;
};

export type ChannelProfileData = {
  userData: ChannelProfile;
}

const UsersProfile = ({ userData }: ChannelProfileData) => {
  const queryClient = useQueryClient();
  const [isChannelSubscribed,setIsChannelSubscribed]=useState(userData.isSubscribed)
  const [subscribersCount, setSubscribersCount] = useState(userData.subscribersCount)
  const [activeTab, setActiveTab] = useState('Videos');

  const subscribeMutation = useMutation({
    mutationFn: toggleSubscribeChannelBtn,
    onSuccess: (data) => {
      console.log(data)
      queryClient.invalidateQueries({ queryKey: ["userSubscribers"] })
    },
    onError:(err)=>{
      console.error(err)
    }
  })
  
  const handleSubscribeToggle = () => {
    subscribeMutation.mutate(userData._id)
    setSubscribersCount((prev) => isChannelSubscribed ? prev - 1 : prev + 1)
    setIsChannelSubscribed((prev)=>!prev)
  }

  useEffect(() => {

  }, [])
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white dark:bg-[#0f0f0f] text-gray-900 dark:text-white pb-10">
      {/* Banner */}
      <div className="w-full h-32 sm:h-48 md:h-56 lg:h-72 bg-gray-200 dark:bg-[#272727] object-cover">
        <img src={userData.coverImage || "https://placehold.co/1920x400/272727/FFF?text=No+Banner"} alt="Banner" className="w-full h-full object-cover" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6">
        {/* Channel Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
          <img
            src={userData.avatar}
            alt="Avatar"
            className="w-24 h-24 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full border-[3px] border-white dark:border-[#0f0f0f] object-cover -mt-12 sm:-mt-8 z-10 bg-white dark:bg-[#0f0f0f]"
          />
          <div className="flex-1 text-center sm:text-left mt-2 sm:mt-0">
            <h1 className="text-2xl sm:text-3xl font-bold mb-1 truncate max-w-xl">{userData.username}</h1>
            <div className="text-sm text-gray-600 dark:text-[#aaaaaa] mb-3 flex flex-col sm:flex-row items-center sm:items-start gap-1 sm:gap-2">
              <span className="font-medium text-gray-800 dark:text-[#f1f1f1]">@{userData.email.split('@')[0]}</span>
              <span className="hidden sm:block">•</span>
              <span>{subscribersCount} subscribers</span>
              <span className="hidden sm:block">•</span>
              <span>{userData.channelSubscribedToCount} subscribed to</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-[#aaaaaa] line-clamp-2 max-w-2xl mb-4 px-4 sm:px-0">
              Welcome to the official channel of {userData.fullName}! Subscribe to never miss an update and join our amazing community!
            </p>
            <div className="flex justify-center sm:justify-start gap-3">
              <button onClick={handleSubscribeToggle} className={`font-semibold py-2 px-5 rounded-full transition-colors text-sm ${isChannelSubscribed ? 'bg-gray-100 text-gray-900 dark:bg-[#272727] dark:text-[#f1f1f1] hover:bg-gray-200 dark:hover:bg-[#3f3f3f]' : 'bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200'}`}>
                {isChannelSubscribed ? "Unsubscribe" : "Subscribe"}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-gray-200 dark:border-[#3f3f3f] mt-8 overflow-x-auto custom-scrollbar hide-scrollbar-arrows">
          {['Home', 'Videos', 'Tweets', 'Playlists', 'Community'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 font-medium text-sm whitespace-nowrap ${activeTab === tab ? 'text-gray-900 dark:text-white border-b-[3px] border-gray-900 dark:border-white' : 'text-gray-600 dark:text-[#aaaaaa] hover:text-gray-900 dark:hover:text-white transition-colors'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Dynamic Content */}
        <div className="mt-6">
          {activeTab === 'Videos' && <VideoSection userId={userData._id} />}
          {activeTab === 'Playlists' && <PlaylistSection userId={userData._id} />}
          {activeTab === 'Community' && <CommunitySection userId={userData._id} />}
          {activeTab === 'Home' && <VideoSection userId={userData._id} />}
          {activeTab === 'Tweets' && <CommunitySection userId={userData._id} />}
        </div>
      </div>
    </div>
  )
}

export default UsersProfile