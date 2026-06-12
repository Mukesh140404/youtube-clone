import { createFileRoute, Link } from '@tanstack/react-router';
import { useUserStore } from '@/store/useUserStore';
import { AiFillLike } from "react-icons/ai";
import { MdHistory, MdOutlinePlaylistPlay } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { ChevronRight } from 'lucide-react';

export const Route = createFileRoute('/(protected)/you')({
  component: YouMobilePage,
});

function YouMobilePage() {
  const user = useUserStore((state) => state.user);

  const secondaryLinks = [
    {
      name: "Your channel",
      to: "/$userId", 
      params: { userId: user?.username },
      icon: <CgProfile className="w-6 h-6" />,
    },
    {
      name: "History",
      to: "/",
      icon: <MdHistory className="w-6 h-6" />,
    },
    {
      name: "Playlists",
      to: "/",
      icon: <MdOutlinePlaylistPlay className="w-6 h-6" />,
    },
    {
      name: "Liked videos",
      to: "/",
      icon: <AiFillLike className="w-6 h-6" />,
    },
  ];

  if (!user) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <div className="p-4 md:p-6 w-full max-w-2xl mx-auto pb-20">
      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-8 p-2">
        <img
          src={user.avatar}
          alt={user.username}
          className="w-20 h-20 rounded-full object-cover border border-gray-200 dark:border-[#3f3f3f]"
        />
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold dark:text-white">{user.fullName}</h1>
          <div className="flex items-center gap-2 text-sm text-[#606060] dark:text-[#aaaaaa] mt-1">
            <span>@{user.username}</span>
            <span>•</span>
            <Link to="/$userId" params={{ userId: user.username }} className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
               View channel <ChevronRight className="inline w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Options List */}
      <div className="bg-white dark:bg-[#0f0f0f] rounded-2xl border border-gray-100 dark:border-[#272727] shadow-sm overflow-hidden">
        {secondaryLinks.map((link, index) => (
          <Link
            key={index}
            to={link.to}
            params={link.params}
            className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-[#161616] transition-colors border-b border-gray-50 dark:border-[#161616] last:border-0"
          >
            <div className="flex items-center gap-4 text-gray-800 dark:text-[#f1f1f1]">
              <span className="text-gray-600 dark:text-[#aaaaaa]">{link.icon}</span>
              <span className="font-medium text-[15px]">{link.name}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
        ))}
      </div>
    </div>
  );
}
