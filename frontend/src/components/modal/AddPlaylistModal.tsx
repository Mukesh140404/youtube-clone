import React, { useState } from "react";
import { X, Loader2, Upload } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPlaylistApi } from "@/client/playlist.api";

interface AddPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | undefined | null;
}

const AddPlaylistModal = ({ isOpen, onClose, userId }: AddPlaylistModalProps) => {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { mutate: createPlaylistMutation, isPending } = useMutation({
    mutationFn: createPlaylistApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPlaylists", userId] });
      resetAndClose();
    },
    onError: (err: any) => {
      console.error("Create playlist error:", err);
      alert(err?.response?.data?.message || "Failed to create playlist");
    },
  });

  const resetAndClose = () => {
    setName("");
    setDescription("");
    setThumbnail(null);
    setPreviewUrl(null);
    onClose();
  };

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

    createPlaylistMutation(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#0f0f0f] border border-gray-200 dark:border-[#3f3f3f] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b dark:border-[#3f3f3f] flex items-center justify-between">
          <h2 className="text-xl font-bold dark:text-white">Create new playlist</h2>
          <button
            type="button"
            onClick={resetAndClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-[#272727] rounded-full transition"
          >
            <X size={24} className="dark:text-white" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-medium dark:text-gray-300">Playlist Cover (Optional)</label>
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
                  <span className="text-sm">Click to upload thumbnail</span>
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
              placeholder="Add a title that describes your playlist"
              maxLength={100}
              className="w-full px-4 py-3 bg-transparent border border-gray-300 dark:border-[#3f3f3f] rounded-lg focus:outline-none focus:border-blue-500 dark:text-white transition"
              required
            />
            <div className="text-xs text-gray-500 text-right mt-1">{name.length}/100</div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell viewers about your playlist"
              maxLength={5000}
              rows={3}
              className="w-full px-4 py-3 bg-transparent border border-gray-300 dark:border-[#3f3f3f] rounded-lg focus:outline-none focus:border-blue-500 dark:text-white resize-none transition"
              required
            />
            <div className="text-xs text-gray-500 text-right mt-1">{description.length}/5000</div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t dark:border-[#3f3f3f] flex justify-end gap-3">
            <button
              type="button"
              onClick={resetAndClose}
              className="px-5 py-2.5 rounded-full font-medium hover:bg-gray-100 dark:hover:bg-[#272727] dark:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !name || !description}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-full font-medium transition flex items-center gap-2"
            >
              {isPending ? <Loader2 size={18} className="animate-spin" /> : null}
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPlaylistModal;