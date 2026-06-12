import React, { useState, useRef, type ChangeEvent } from "react";
import { X, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addNewVideoApi } from "@/client/video.api"; // Maan ke chal raha hoon ye path hai

interface AddVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string|undefined|null;
}

const AddVideoModal = ({ isOpen, onClose, userId }: AddVideoModalProps) => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const {mutate:uploadVideoMutation,isPending} = useMutation({
    mutationFn: addNewVideoApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userVideos", userId] });
      resetAndClose();
    },
    onError: (err) => {
      console.error("Upload error:", err);
      alert("Failed to upload video");
    }
  });

  const resetAndClose = () => {
    setTitle("");
    setDescription("");
    setVideoFile(null);
    setThumbnailFile(null);
    setThumbnailPreview(null);
    onClose();
  };

  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !videoFile || !thumbnailFile) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("videoFile", videoFile);
    formData.append("thumbnail", thumbnailFile);

    uploadVideoMutation({
      title,
      description,
      videoFile,
      thumbnail:thumbnailFile
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#0f0f0f] border border-gray-200 dark:border-[#3f3f3f] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b dark:border-[#3f3f3f] flex items-center justify-between">
          <h2 className="text-xl font-bold dark:text-white">Upload video</h2>
          <button onClick={resetAndClose} className="p-2 hover:bg-gray-100 dark:hover:bg-[#272727] rounded-full transition">
            <X size={24} className="dark:text-white" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          
          {/* Video Selection Area */}
          <div 
            onClick={() => videoInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition
              ${videoFile ? 'border-blue-500 bg-blue-50/10' : 'border-gray-300 dark:border-[#3f3f3f] hover:border-blue-500'}`}
          >
            <input type="file" hidden ref={videoInputRef} accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} />
            <div className="bg-gray-100 dark:bg-[#272727] p-4 rounded-full mb-3">
              <Upload className="text-blue-600" size={32} />
            </div>
            <p className="font-medium dark:text-white">
              {videoFile ? videoFile.name : "Select video file to upload"}
            </p>
            <p className="text-sm text-gray-500 mt-1">Your videos will be private until you publish them.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 dark:text-gray-300">Title (required)</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-transparent border border-gray-300 dark:border-[#3f3f3f] rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                  placeholder="Add a title that describes your video"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 dark:text-gray-300">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full bg-transparent border border-gray-300 dark:border-[#3f3f3f] rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white resize-none"
                  placeholder="Tell viewers about your video"
                />
              </div>
            </div>

            {/* Thumbnail Selection */}
            <div className="space-y-4">
              <label className="block text-sm font-medium dark:text-gray-300">Thumbnail</label>
              <div 
                onClick={() => thumbnailInputRef.current?.click()}
                className="aspect-video bg-gray-100 dark:bg-[#272727] rounded-lg border border-gray-300 dark:border-[#3f3f3f] overflow-hidden flex items-center justify-center cursor-pointer group relative"
              >
                <input type="file" hidden ref={thumbnailInputRef} accept="image/*" onChange={handleThumbnailChange} />
                {thumbnailPreview ? (
                  <img src={thumbnailPreview} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <div className="flex flex-col items-center text-gray-500">
                    <ImageIcon size={24} />
                    <span className="text-xs mt-2">Upload thumbnail</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                   <Upload size={20} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t dark:border-[#3f3f3f] flex justify-end gap-3">
          <button 
            onClick={resetAndClose}
            className="px-4 py-2 text-sm font-bold hover:bg-gray-100 dark:hover:bg-[#272727] rounded-full dark:text-white transition"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={!title || !videoFile || !thumbnailFile || isPending}
            className={`px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition ${
              title && videoFile && thumbnailFile && !isPending
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 dark:bg-[#272727] text-gray-400 cursor-not-allowed"
            }`}
          >
            {isPending ? <Loader2 className="animate-spin" size={18} /> : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddVideoModal;