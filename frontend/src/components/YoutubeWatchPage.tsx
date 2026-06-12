import React from "react";
import { 
  ThumbsUp, ThumbsDown, Share2, MoreHorizontal, ListVideo 
} from "lucide-react";

// --- Types ---
type VideoData = {
  title: string;
  views: string;
  timestamp: string;
  channelName: string;
  subscribers: string;
  description: string;
};

// --- Sub-Component: Video Player ---
const VideoPlayer = () => (
  <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
    <div className="w-full h-full flex items-center justify-center group relative">
      {/* Placeholder for actual video iframe/player */}
      <img 
        src="https://images.unsplash.com/photo-1512152272829-e3139592d56f?w=1200" 
        className="w-full h-full object-cover opacity-80" 
        alt="Video Thumbnail"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white">
          <div className="ml-1 border-y-[10px] border-y-transparent border-l-[18px] border-l-white"></div>
        </div>
      </div>
    </div>
  </div>
);

// --- Sub-Component: Video Details & Actions ---
const VideoDetails = ({ data }: { data: VideoData }) => (
  <div className="mt-4 space-y-4">
    <h1 className="text-xl font-bold line-clamp-2 leading-tight">{data.title}</h1>
    
    <div className="flex flex-wrap items-center justify-between gap-4">
      {/* Channel Info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 to-red-500 overflow-hidden">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alien" alt="avatar" />
        </div>
        <div>
          <h3 className="font-bold text-md flex items-center gap-1">
            {data.channelName} <CheckCircleIcon />
          </h3>
          <p className="text-xs text-gray-500 dark:text-[#aaaaaa]">{data.subscribers} subscribers</p>
        </div>
        <button className="ml-4 bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition">
          Subscribe
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center bg-gray-100 dark:bg-[#272727] rounded-full">
          <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 dark:hover:bg-[#3f3f3f] border-r border-gray-300 dark:border-[#444] rounded-l-full">
            <ThumbsUp size={18} /> <span className="text-sm font-medium">291K</span>
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
        <span>{data.views}</span>
        <span>{data.timestamp}</span>
      </div>
      <p className="whitespace-pre-wrap">{data.description}</p>
      <button className="font-bold mt-2">...more</button>
    </div>
  </div>
);

// --- Sub-Component: Sidebar Video Card ---
const SidebarVideoCard = () => (
  <div className="flex gap-2 group cursor-pointer">
    <div className="relative shrink-0 w-40 aspect-video rounded-lg overflow-hidden bg-gray-200 dark:bg-[#272727]">
        <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400" className="w-full h-full object-cover" alt="rec" />
        <span className="absolute bottom-1 right-1 bg-black text-white text-[10px] px-1 rounded">12:45</span>
    </div>
    <div className="flex-1 space-y-1">
      <h4 className="text-sm font-bold line-clamp-2 leading-snug">The Revenge of the Forgotten King | Anime Recap</h4>
      <p className="text-xs text-gray-500 dark:text-[#aaaaaa]">Alien Kings</p>
      <p className="text-xs text-gray-500 dark:text-[#aaaaaa]">156K views • 2 days ago</p>
    </div>
  </div>
);

// --- Helper Components ---
const ActionButton = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <button className="flex items-center gap-2 bg-gray-100 dark:bg-[#272727] px-4 py-2 rounded-full hover:bg-gray-200 dark:hover:bg-[#3f3f3f] transition text-sm font-medium">
    {icon} {label && <span>{label}</span>}
  </button>
);

const CheckCircleIcon = () => (
    <svg viewBox="0 0 24 24" className="w-3 h-3 fill-gray-500"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zM10 17l-5-5 1.4-1.4 3.6 3.6 7.6-7.6L19 8l-9 9z"></path></svg>
);

// --- Main Page Component ---
const YouTubeWatchPage = () => {
  const videoInfo: VideoData = {
    title: "Uski Zindagi Barbaad Kar Di... Ab Khel Palatne Wala Hai; he took the revenge after time flips.",
    views: "291K views",
    timestamp: "4 days ago",
    channelName: "Alien Kings",
    subscribers: "70.8K",
    description: "In a world where every student is assigned a spirit beast based on their rank, the top student chooses a powerful SSS rank serpent, while the lowest ranked boy is left with a weak F rank black bear.\n\nMocked and underestimated, his fate seems sealed - until a deadly winter arrives..."
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f0f0f] text-gray-900 dark:text-white px-4 py-4 md:px-6 lg:px-12">
      <div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Player & Comments (8/12 space) */}
        <div className="lg:col-span-8 space-y-6">
          <VideoPlayer />
          <VideoDetails data={videoInfo} />
          
          {/* Comments Summary Section */}
          <div className="pt-4">
            <div className="flex items-center gap-6 mb-6">
              <h2 className="text-xl font-bold">90 Comments</h2>
              <button className="flex items-center gap-2 font-medium text-sm">
                <ListVideo size={18} /> Sort by
              </button>
            </div>
            
            {/* Add Comment */}
            <div className="flex gap-4 mb-8">
               <div className="w-10 h-10 rounded-full bg-blue-500 shrink-0"></div>
               <div className="flex-1">
                 <input 
                   type="text" 
                   placeholder="Add a comment..." 
                   className="w-full bg-transparent border-b border-gray-300 dark:border-[#3f3f3f] pb-1 focus:border-black dark:focus:border-white outline-none transition text-sm"
                 />
               </div>
            </div>

            {/* Mock Comment List */}
            {[1, 2, 3].map((i) => (
               <div key={i} className="flex gap-4 mb-6 group">
                 <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-[#272727] shrink-0"></div>
                 <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold">@User_Handle_{i}</span>
                        <span className="text-gray-500">2 hours ago</span>
                    </div>
                    <p className="text-sm">This anime recap is fire! Please upload part 2 as soon as possible. ❤️🔥</p>
                    <div className="flex items-center gap-4 mt-2">
                        <ThumbsUp size={14} className="cursor-pointer" />
                        <ThumbsDown size={14} className="cursor-pointer" />
                        <span className="text-xs font-bold cursor-pointer">Reply</span>
                    </div>
                 </div>
               </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Sidebar (4/12 space) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Category Chips */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {["All", "From Alien Kings", "Comic books", "Anime", "Manga"].map(chip => (
              <span key={chip} className="bg-gray-100 dark:bg-[#272727] px-3 py-1 rounded-lg text-sm whitespace-nowrap cursor-pointer hover:bg-gray-200 dark:hover:bg-[#3f3f3f]">
                {chip}
              </span>
            ))}
          </div>
          
          {/* Recommendation List */}
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(item => (
              <SidebarVideoCard key={item} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default YouTubeWatchPage;