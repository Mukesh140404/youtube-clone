import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlaySquare, MoreVertical, Trash2, Edit2, Share2, Plus, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { getPlaylistByIdApi, removeVideoFromPlaylistApi, deletePlaylistApi } from '@/client/playlist.api';
import {useUserStore} from '@/store/useUserStore';
import AddVideoToPlaylistModal from '@/components/modal/AddVideoToPlaylistModal';
import UpdatePlaylistModal from '@/components/modal/UpdatePlaylistModal';
import { formatDateTime } from '@/utils/formateDateTime';

export const Route = createFileRoute('/(protected)/playlist/$playlistId')({
  component: PlaylistDetailsPage,
});

function PlaylistDetailsPage() {
  const { playlistId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useUserStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);

  const { data: playlist, isLoading, isError } = useQuery({
    queryKey: ['playlist', playlistId],
    queryFn: () => getPlaylistByIdApi(playlistId),
  });


  const { mutate: removeVideo, isPending: isRemoving } = useMutation({
    mutationFn: (videoId: string) => removeVideoFromPlaylistApi(playlistId, videoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlist', playlistId] });
      setMenuOpenFor(null);
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || 'Failed to remove video');
    }
  });

  const { mutate: deletePlaylist, isPending: isDeleting } = useMutation({
    mutationFn: () => deletePlaylistApi(playlistId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPlaylists'] });
      navigate({ to: `/${user?._id}` });
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || 'Failed to delete playlist');
    }
  });

  const isOwner = user?._id && (user._id === playlist?.owner || user._id === playlist?.owner?._id);

  // Handle outside click for menu
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpenFor(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-blue-500" size={40} /></div>;
  if (isError || !playlist) return <div className="text-center mt-20 text-xl font-semibold">Playlist not found</div>;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white dark:bg-[#0f0f0f] text-gray-900 dark:text-white pt-6 pb-20 px-4 md:px-8 gap-6 max-w-7xl mx-auto">
      
      {/* Left Sidebar - Playlist Info */}
      <div className="w-full lg:w-90 xl:w-100 shrink-0">
        <div className="bg-gray-100 dark:bg-[#272727] rounded-2xl p-6 sticky top-20">
          <div className="aspect-video bg-gray-200 dark:bg-[#3f3f3f] rounded-xl overflow-hidden mb-6 flex items-center justify-center">
             {/* If the backend populates videos with objects in getPlaylistById, we can show thumbnail. Assuming it does or we show placeholder */}
            {playlist.thumbnail || (playlist.videos && playlist.videos.length > 0 && playlist.videos[0].thumbnail) ? (
              <img src={playlist.thumbnail || playlist.videos[0].thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
            ) : (
              <PlaySquare size={64} className="text-gray-400" />
            )}
          </div>
          <h1 className="text-2xl font-bold mb-4">{playlist.name}</h1>
          
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-6 space-y-1">
            <p className="font-medium text-black dark:text-white">{user?.fullName}</p>
            <p>{playlist.videos?.length || 0} videos • Updated {formatDateTime(playlist.updatedAt).date}</p>
          </div>

          <div className="flex gap-2 mb-6">
            <button className="flex-1 bg-black dark:bg-white text-white dark:text-black py-2.5 rounded-full font-medium flex items-center justify-center gap-2 transition hover:bg-gray-800 dark:hover:bg-gray-200">
              <PlaySquare size={18} /> Play all
            </button>
            <button className="p-2.5 bg-gray-200 dark:bg-[#3f3f3f] rounded-full hover:bg-gray-300 dark:hover:bg-[#4f4f4f] transition">
              <Share2 size={18} />
            </button>
          </div>

          {isOwner && (
            <div className="flex gap-2 mb-6">
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="flex-1 py-2 bg-gray-200 dark:bg-[#3f3f3f] rounded-full font-medium flex items-center justify-center gap-2 hover:bg-gray-300 dark:hover:bg-[#4f4f4f] transition text-sm"
              >
                <Edit2 size={16} /> Edit
              </button>
              <button 
                onClick={() => {
                  if(window.confirm('Are you sure you want to delete this playlist?')) {
                    deletePlaylist();
                  }
                }}
                disabled={isDeleting}
                className="flex-1 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-red-200 dark:hover:bg-red-900/50 transition text-sm disabled:opacity-50"
              >
                {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />} Delete
              </button>
            </div>
          )}

          <p className="text-sm mt-4 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {playlist.description || "No description"}
          </p>
        </div>
      </div>

      {/* Right Column - Video List */}
      <div className="flex-1 mt-4 lg:mt-0">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Videos</h2>
          {isOwner && (
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="text-sm font-medium flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/40 transition"
            >
              <Plus size={16} /> Add Videos
            </button>
          )}
        </div>

        <div className="flex flex-col space-y-4">
          {(!playlist.videos || playlist.videos.length === 0) ? (
            <div className="text-center py-20 bg-gray-50 dark:bg-[#272727] rounded-xl border border-dashed border-gray-300 dark:border-[#3f3f3f]">
              <PlaySquare size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No videos yet</h3>
              <p className="text-gray-500 text-sm">Add videos to your playlist to watch them later.</p>
            </div>
          ) : (
            playlist.videos.map((video: any, index: number) => {
              // Fallback if video is just an ID (string)
              // if (typeof video === 'string') return <div key={index} className="p-4 border dark:border-[#3f3f3f] rounded-xl text-sm text-gray-500">Video ID: {video} (Not populated)</div>;

              return (
                <div key={video._id} className="flex gap-4 p-3 hover:bg-gray-100 dark:hover:bg-[#272727] rounded-xl transition group relative">
                  <div className="flex items-center justify-center w-6 text-gray-400 text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="w-40 h-24 bg-gray-200 dark:bg-[#3f3f3f] rounded-lg overflow-hidden shrink-0 cursor-pointer" onClick={() => navigate({ to: '/watch', search: { v: video._id } })}>
                    <img src={video.thumbnail || "https://placehold.co/600x400/272727/FFF?text=Video"} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                  </div>
                  <div className="flex-1 min-w-0 py-1">
                    <h3 className="text-base font-semibold line-clamp-2 mb-1 cursor-pointer hover:text-blue-500" onClick={() => navigate({ to: '/watch', search: { v: video._id } })}>
                      {video.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {video.owner?.fullName || "Unknown Owner"} • {video.views || 0} views
                    </p>
                  </div>
                  
                  {isOwner && (
                    <div className="flex items-center" ref={menuOpenFor === video._id ? menuRef : null}>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setMenuOpenFor(menuOpenFor === video._id ? null : video._id); }}
                        className="p-2 text-gray-500 hover:text-black dark:hover:text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                      >
                        <MoreVertical size={20} />
                      </button>
                      
                      {menuOpenFor === video._id && (
                        <div className="absolute right-8 top-10 bg-white dark:bg-[#272727] border border-gray-200 dark:border-[#3f3f3f] rounded-lg shadow-xl py-2 w-48 z-10">
                          <button 
                            onClick={() => removeVideo(video._id)}
                            disabled={isRemoving}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#3f3f3f] flex items-center gap-3 text-red-500 text-sm"
                          >
                            <Trash2 size={16} /> Remove from playlist
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      <AddVideoToPlaylistModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        playlistId={playlistId} 
        userId={user?._id || ''} 
        existingVideoIds={playlist.videos?.map((v: any) => typeof v === 'string' ? v : v._id) || []}
      />

      <UpdatePlaylistModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        playlist={playlist}
      />
    </div>
  );
}
