import React from "react";

interface DeleteModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  onClose: (confirm: boolean) => void;
}

const DeleteModal = ({ isOpen, title, description, onClose }: DeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#0f0f0f] border border-gray-200 dark:border-[#3f3f3f] rounded-2xl p-6 w-full max-w-sm shadow-2xl mx-4">
        <h3 className="text-xl font-bold mb-2 dark:text-white">{title}</h3>
        <p className="text-[#606060] dark:text-[#aaaaaa] text-sm mb-6">
          {description}
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => onClose(false)}
            className="px-4 py-2 rounded-full font-semibold bg-gray-100 dark:bg-[#272727] hover:bg-gray-200 dark:hover:bg-[#3f3f3f] transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onClose(true)}
            className="px-4 py-2 rounded-full font-semibold bg-red-600 hover:bg-red-700 text-white transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;