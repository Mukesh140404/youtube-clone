import React, { useState, useEffect } from "react";
import { X, Loader2, Upload } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePlaylistApi } from "@/client/playlist.api";

interface UpdatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlist: any;
}

const UpdatePlaylistModal = ({ isOpen, onClose, playlist }: UpdatePlaylistModalProps) => {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (playlist && isOpen) {
      setName(playlist.name || "");
      setDescription(playlist.description || "");
      setPreviewUrl(playlist.thumbnail || null);
      setThumbnail(null);
    }
  }, [playlist, isOpen]);

  const { mutate: updateMutation, isPending } = useMutation({
    mutationFn: (data: FormData) => updatePlaylistApi(playlist._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlist", playlist._id] });
      queryClient.invalidateQueries({ queryKey: ["userPlaylists"] });
      onClose();
    },
    onError: (err: any) => {
      console.error("Update playlist error:", err);
      alert(err?.response?.data?.message || "Failed to update playlist");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    updateMutation(formData);
  };

  if (!isOpen || !playlist) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#0f0f0f] border border-gray-200 dark:border-[#3f3f3f] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b dark:border-[#3f3f3f] flex items-center justify-between">
          <h2 className="text-xl font-bold dark:text-white">Edit Playlist</h2>
          <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-[#272727] rounded-full transition">
            <X size={24} className="dark:text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-medium dark:text-gray-300">Playlist Cover</label>
            <div className="relative w-full aspect-video bg-gray-100 dark:bg-[#272727] rounded-lg overflow-hidden border-2 border-dashed border-gray-300 dark:border-[#3f3f3f] flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-[#323232] transition group">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              />
              {previewUrl ? (
                <img src={previewUrl} alt="Cover Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <Upload size={32} className="mb-2 group-hover:text-blue-500 transition" />
                  <span className="text-sm">Click to upload new cover</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Title</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Playlist title"
              maxLength={100}
              className="w-full px-4 py-3 bg-transparent border border-gray-300 dark:border-[#3f3f3f] rounded-lg focus:outline-none focus:border-blue-500 dark:text-white transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Playlist description"
              maxLength={5000}
              rows={3}
              className="w-full px-4 py-3 bg-transparent border border-gray-300 dark:border-[#3f3f3f] rounded-lg focus:outline-none focus:border-blue-500 dark:text-white resize-none transition"
              required
            />
          </div>

          <div className="pt-4 border-t dark:border-[#3f3f3f] flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full font-medium hover:bg-gray-100 dark:hover:bg-[#272727] dark:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !name || !description}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-full font-medium transition flex items-center gap-2"
            >
              {isPending && <Loader2 size={18} className="animate-spin" />}
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePlaylistModal;