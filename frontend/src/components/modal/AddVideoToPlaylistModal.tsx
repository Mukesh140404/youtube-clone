import { useState } from "react";
import { X, Search, Plus, CheckCircle2, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserAllVideoApi } from "@/client/video.api";
import { addVideosInPlaylistApi } from "@/client/playlist.api";

interface AddVideoToPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlistId: string;
  userId: string;
  existingVideoIds?: string[];
}

const AddVideoToPlaylistModal = ({ isOpen, onClose, playlistId, userId, existingVideoIds = [] }: AddVideoToPlaylistModalProps) => {
  const queryClient = useQueryClient();
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const { data: videos, isLoading } = useQuery({
    queryKey: ["userVideos", userId],
    queryFn: () => getUserAllVideoApi(userId),
    enabled: isOpen && !!userId,
  });

  const { mutate: addVideosMutation, isPending } = useMutation({
    mutationFn: (videoIds: string[]) => addVideosInPlaylistApi(playlistId, videoIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlist", playlistId] });
      resetAndClose();
    },
    onError: (err: any) => {
      console.error("Add videos error:", err);
      alert(err?.response?.data?.message || "Failed to add videos");
    },
  });

  const resetAndClose = () => {
    setSelectedVideos([]);
    setSearch("");
    onClose();
  };

  const toggleVideoSelection = (videoId: string) => {
    setSelectedVideos(prev => 
      prev.includes(videoId) ? prev.filter(id => id !== videoId) : [...prev, videoId]
    );
  };

  const handleSave = () => {
    if (selectedVideos.length === 0) return;
    addVideosMutation(selectedVideos);
  };

  if (!isOpen) return null;

  const filteredVideos = videos?.videos.filter((video: any) => 
    video.title.toLowerCase().includes(search.toLowerCase()) && 
    !existingVideoIds.includes(video._id)
  ) || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#0f0f0f] border border-gray-200 dark:border-[#3f3f3f] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b dark:border-[#3f3f3f] flex items-center justify-between">
          <h2 className="text-xl font-bold dark:text-white">Add videos to playlist</h2>
          <button onClick={resetAndClose} className="p-2 hover:bg-gray-100 dark:hover:bg-[#272727] rounded-full transition">
            <X size={24} className="dark:text-white" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b dark:border-[#3f3f3f]">
          <div className="flex items-center bg-gray-100 dark:bg-[#272727] rounded-lg px-3 py-2">
            <Search size={18} className="text-gray-500 mr-2" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your videos..." 
              className="bg-transparent border-none outline-none w-full dark:text-white text-sm"
            />
          </div>
        </div>

        {/* Video List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-blue-500" size={24} />
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className="text-center py-10 text-gray-500 text-sm">
              {search ? "No matching videos found." : "No new videos available to add."}
            </div>
          ) : (
            filteredVideos.map((video: any) => {
              const isSelected = selectedVideos.includes(video._id);
              return (
                <div 
                  key={video._id} 
                  onClick={() => toggleVideoSelection(video._id)}
                  className={`flex gap-3 p-2 rounded-xl cursor-pointer transition ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-[#272727]'}`}
                >
                  <div className="w-24 h-14 bg-gray-200 dark:bg-[#3f3f3f] rounded-lg overflow-hidden shrink-0">
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h4 className="text-sm font-semibold dark:text-white line-clamp-2">{video.title}</h4>
                  </div>
                  <div className="flex items-center justify-center px-2">
                    {isSelected ? (
                      <CheckCircle2 size={20} className="text-blue-600 dark:text-blue-500" />
                    ) : (
                      <Plus size={20} className="text-gray-400" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t dark:border-[#3f3f3f] flex justify-end gap-3 bg-gray-50 dark:bg-[#0f0f0f]">
          <button onClick={resetAndClose} className="px-4 py-2 font-medium hover:bg-gray-200 dark:hover:bg-[#272727] rounded-full dark:text-white transition text-sm">
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={selectedVideos.length === 0 || isPending}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-full font-medium transition text-sm flex items-center gap-2"
          >
            {isPending && <Loader2 size={16} className="animate-spin" />}
            Add {selectedVideos.length > 0 ? selectedVideos.length : ""} videos
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddVideoToPlaylistModal;