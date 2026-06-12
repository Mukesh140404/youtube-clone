import { useQuery } from "@tanstack/react-query";
import { ListPlus, PlaySquare, Loader2 } from "lucide-react";
import { getAllPlaylistOfUserApi } from "@/client/playlist.api";
import { Link } from "@tanstack/react-router";

interface PlaylistSectionProps {
  userId: string;
  onOpenModal?: () => void;
}

const PlaylistSection = ({ userId, onOpenModal }: PlaylistSectionProps) => {
  const { data: playlists, isLoading, isError } = useQuery({
    queryKey: ["userPlaylists", userId],
    queryFn: () => getAllPlaylistOfUserApi(userId),
    enabled: !!userId,
    retry: false, // Don't retry if 404 (not exists)
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  // Handle errors or empty playlists
  if (isError || !playlists || playlists.length === 0) {
    return (
      <div className="flex flex-col items-center py-10">
        <ListPlus size={48} className="text-gray-400 mb-4" />
        <h3 className="text-lg font-bold">No Playlists Created</h3>
        <p className="text-sm text-gray-500 mt-1 text-center max-w-sm">
          You haven't created any playlists yet.
        </p>
        {onOpenModal && (
          <button
            onClick={onOpenModal}
            className="text-blue-500 mt-4 font-medium hover:underline flex items-center gap-2"
          >
            Create a new playlist now
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {playlists.map((playlist: any) => (
        <Link 
          key={playlist._id} 
          to="/playlist/$playlistId" 
          params={{ playlistId: playlist._id }}
          className="flex flex-col gap-2 group cursor-pointer"
        >
          <div className="relative aspect-video rounded-xl bg-gray-200 dark:bg-[#272727] overflow-hidden flex items-center justify-center">
            {playlist.thumbnail || (playlist.videos && playlist.videos.length > 0) ? (
              <img
                src={playlist.thumbnail || playlist.videos[0]?.thumbnail || "https://placehold.co/600x400/272727/FFF?text=Playlist"}
                alt={playlist.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
            ) : (
              <PlaySquare size={48} className="text-gray-400" />
            )}
            
            <div className="absolute right-2 bottom-2 bg-black/80 text-white text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
              <ListPlus size={14} />
              {playlist.videos ? playlist.videos.length : 0} videos
            </div>
            
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <div className="bg-black/80 text-white text-sm font-medium px-4 py-2 rounded-full flex items-center gap-2">
                <PlaySquare size={16} /> Play All
              </div>
            </div>
          </div>

          <div className="flex flex-col pr-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">
              {playlist.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
              View full playlist
            </p>
          </div>
        </Link>
      ))}

      {/* Add New Playlist Button */}
      {onOpenModal && (
        <div 
          onClick={onOpenModal}
          className="flex flex-col gap-2 cursor-pointer group"
        >
          <div className="relative aspect-video rounded-xl bg-gray-100 dark:bg-[#1a1a1a] border-2 border-dashed border-gray-300 dark:border-[#3f3f3f] overflow-hidden flex flex-col items-center justify-center hover:bg-gray-200 dark:hover:bg-[#272727] transition duration-300">
            <ListPlus size={32} className="text-gray-500 group-hover:text-blue-500 transition-colors mb-2" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-blue-500 transition-colors">New Playlist</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistSection;