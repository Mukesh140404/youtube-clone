import { useState, useRef, type ChangeEvent } from "react";
import { Camera, ListPlus, Send, Video } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChangeAvatarApi, ChangeCoverImageApi } from "@/client/user.api";
import { AddTweetApi } from "@/client/tweet.api";
import CommunitySection from "./CommunitySection";
import VideoSection from "./VideoSection";
import PlaylistSection from "./PlaylistSection";
import AddVideoModal from "../modal/AddVideoModal";
import AddPlaylistModal from "../modal/AddPlaylistModal";

// --- Types ---
export type tab =
  | "Home"
  | "Videos"
  | "Tweets"
  | "Live"
  | "Playlists"
  | "Community";
export type User = {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  coverImage: string;
  subscriberCount: number;
};
export type Users = { userData: User };

const LoggedUserProfile = ({ userData }: Users) => {
  const [activeTab, setActiveTab] = useState<tab>("Videos");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);

  const [postText, setPostText] = useState("");
  const queryClient = useQueryClient();

  // States for dynamic image updates
  const [avatar, setAvatar] = useState(userData.avatar);
  const [banner, setBanner] = useState(userData.coverImage);

  // Refs for hidden inputs
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);


  const avatarMutation = useMutation({
    mutationFn: ChangeAvatarApi,

    onSuccess: (user) => {
      console.log("USER:", user);

      if (user?.avatar) {
        setAvatar(user.avatar);
      }

      queryClient.invalidateQueries({ queryKey: ["user"] });
    },

    onError: (err) => {
      console.log("MUTATION ERROR:", err);
    },
  });
  const coverMutation = useMutation({
    mutationFn: ChangeCoverImageApi,

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      setBanner(data.coverImage);
    },
  });
  const tweetMutation = useMutation({
    mutationFn: AddTweetApi,

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["usertweets", userData._id] });
      console.log(data);
    },
    onError: (err) => {
      console.log("MUTATION ERROR:", err);
    },
  });

  // console.log("res data is: ",data)

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    type: "avatar" | "banner",
  ) => {
    const file = e.target.files?.[0];
    console.log("File: ", file);
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    if (type === "avatar") {
      setAvatar(previewUrl);

      avatarMutation.mutate({ avatar: file });
    } else {
      setBanner(previewUrl);

      coverMutation.mutate({ coverImage: file });
    }
  };

  // Mock function for Posting a "Tweet" (Community Post)
  const handlePostSubmit = () => {
    const content = postText.trim();
    if (!content) return;
    // alert(`Community Post Published: ${postText}`);
    tweetMutation.mutate({ content: content });
    setPostText("");
  };

  const tabs: tab[] = ["Videos", "Playlists", "Community"];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f0f0f] text-gray-900 dark:text-white font-sans">
      {/* Hidden File Inputs */}
      <input
        type="file"
        hidden
        ref={avatarInputRef}
        onChange={(e) => handleFileChange(e, "avatar")}
        accept="image/*"
      />
      <input
        type="file"
        hidden
        ref={bannerInputRef}
        onChange={(e) => handleFileChange(e, "banner")}
        accept="image/*"
      />
      

      <div className="max-w-321 mx-auto">
        {/* Banner Area with Change Option */}
        <div className="relative group w-full aspect-6/1 overflow-hidden rounded-xl mt-4 bg-gray-200 dark:bg-[#272727]">
          <img
            src={banner}
            className="w-full h-full object-cover"
            alt="banner"
          />
          <button
            onClick={() => bannerInputRef.current?.click()}
            className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          >
            <div className="bg-black/60 p-3 rounded-full text-white flex items-center gap-2">
              <Camera size={20} />{" "}
              <span className="text-sm font-medium">Change Banner</span>
            </div>
          </button>
        </div>

        {/* Profile Info Section */}
        <div className="px-6 py-6 flex flex-row gap-6 items-center">
          <div className="relative shrink-0 group">
            <img
              src={avatar}
              alt="Avatar"
              className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover border-4 border-white dark:border-[#0f0f0f] bg-white"
            />
            <button
              onClick={() => avatarInputRef.current?.click()}
              className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 p-2.5 rounded-full text-white shadow-lg transition"
            >
              <Camera size={18} />
            </button>
          </div>

          <div className="flex-1 space-y-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold">{userData.fullName}</h1>
              <p className="text-[#606060] dark:text-[#aaaaaa] text-sm">
                @{userData.username}
              </p>
              <p className="text-[#606060] dark:text-[#aaaaaa] text-sm">
                {userData.subscriberCount} subscribers
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#f9f9f9] dark:bg-[#0f0f0f] border border-gray-200 dark:border-[#3f3f3f] rounded-xl p-4 shadow-sm w-11/12 mb-4 mx-auto">
          <div className="flex gap-4">
            <img
              src={avatar}
              className="w-10 h-10 rounded-full object-cover"
              alt="user"
            />
            <div className="flex-1">
              <textarea
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                placeholder="What's on your mind? (Tweet something...)"
                className="w-full bg-transparent border-none focus:ring-0 text-md resize-none mb-4 outline-none min-h-12.5"
              />

              <div className="flex flex-wrap items-center justify-between border-t dark:border-[#272727] pt-3">
                <button
                  onClick={handlePostSubmit}
                  disabled={!postText.trim()}
                  className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition ${
                    postText.trim()
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-200 dark:bg-[#272727] text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <Send size={16} /> Post
                </button>
                <div className="space-x-6 flex">
                <button onClick={() => setIsUploadModalOpen(true)} className="bg-gray-200 dark:bg-[#272727] flex items-center p-4 rounded-full text-sm font-bold transition cursor-pointer">
                  <Video size={16}/>
                </button>
                <button onClick={() => setIsPlaylistModalOpen(true)} className="bg-gray-200 dark:bg-[#272727] flex items-center p-4 rounded-full text-sm font-bold transition cursor-pointer">
                  <ListPlus size={16}/>
                </button></div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 dark:border-[#3f3f3f] px-4 mx-5 overflow-x-auto">
          <div className="flex space-x-6 min-w-max">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`pb-3 text-sm font-medium relative ${
                  activeTab === t
                    ? "text-black dark:text-white border-b-2 border-black dark:border-white"
                    : "text-[#606060] dark:text-[#aaaaaa]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="mt-6 px-8 pb-20">
          {activeTab === "Community" && (
            <CommunitySection userId={userData._id} />
          )}

          {activeTab === "Videos" && (
            <VideoSection userId={userData._id}/>
          )}

          {activeTab === "Playlists" && (
            <PlaylistSection userId={userData._id} onOpenModal={() => setIsPlaylistModalOpen(true)} />
          )}
        </div>
      </div>
      <AddVideoModal isOpen={isUploadModalOpen} onClose={()=> setIsUploadModalOpen(false)} userId={userData._id} />
      <AddPlaylistModal isOpen={isPlaylistModalOpen} onClose={()=> setIsPlaylistModalOpen(false)} userId={userData._id} />
    </div>
  );
};

export default LoggedUserProfile;
