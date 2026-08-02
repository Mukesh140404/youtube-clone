import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { AiFillHome, AiFillLike } from "react-icons/ai";
import {
  MdOutlineBolt,
  MdHistory,
  MdOutlinePlaylistPlay,
} from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import SubscribesList from "./SubscribesList";
import { useUserStore } from "@/store/useUserStore";

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const [isHovered, setIsHovered] = useState(false);
  const user = useUserStore((state) => state.user);

  const mainLinks = [
    {
      name: "Home",
      to: "/",
      icon: <AiFillHome className="w-6 h-6" />,
    },
    {
      name: "Tweets",
      to: "/tweets",
      icon: <MdOutlineBolt className="w-6 h-6" />,
    },
  ];

  const secondaryLinks = [
    {
      name: "Your channel",
      to: `/${user?.username}`,
      icon: <CgProfile className="w-6 h-6" />,
    },
    {
      name: "History",
      to: "/history",
      icon: <MdHistory className="w-6 h-6" />,
    },
    {
      name: "Playlists",
      to: "/",
      icon: <MdOutlinePlaylistPlay className="w-6 h-6" />,
    },
    {
      name: "Liked videos",
      to: "/liked-videos",
      icon: <AiFillLike className="w-6 h-6" />,
    },
  ];


  // Bottom navigation on mobile shouldn't have all secondary links
  const mobileNavLinks = [
    ...mainLinks,
    {
      name: "Subscriptions",
      to: "/subscriptions",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
        </svg>
      )
    },
    { name: "You", to: "/you", icon: <CgProfile className="w-6 h-6" /> },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`hidden md:block shrink-0 h-full relative z-40 transition-[width] duration-300 ease-in-out ${isOpen ? "w-64" : "w-20"}`}
      >
        {/* Mini Sidebar */}
        <div
          className={`absolute top-0 left-0 w-20 h-full bg-white dark:bg-[#0f0f0f] flex flex-col items-center py-4 z-10 transition-opacity duration-200 ${isOpen || isHovered ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        >
          {mobileNavLinks.map((link, index) => (
            <Link
              key={index}
              to={link.to}
              className="flex flex-col items-center justify-center py-4 w-16 rounded-xl hover:bg-gray-100 dark:hover:bg-[#272727] transition-colors mb-1"
            >
              <span className="text-gray-800 dark:text-[#f1f1f1] mb-1">
                {link.icon}
              </span>
              <span className="text-[10px] font-medium text-gray-800 dark:text-[#f1f1f1]">
                {link.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Full Sidebar (Expands on hover if closed) */}
        <div
          className={`absolute top-0 left-0 w-64 h-full bg-white dark:bg-[#0f0f0f] overflow-y-auto custom-scrollbar pb-6 z-20 transition-all duration-300 ease-in-out ${isOpen || isHovered ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"} ${!isOpen && isHovered ? "shadow-2xl border-r border-gray-200 dark:border-[#3f3f3f]" : "border-r border-gray-100 dark:border-[#272727]"}`}
        >
          {/* Main Links */}
          <div className="py-3 border-b border-gray-100 dark:border-[#272727]">
            {mainLinks.map((link, index) => (
              <Link
                key={index}
                to={link.to}
                className="flex items-center px-4 py-2.5 mx-3 rounded-xl hover:bg-gray-100 dark:hover:bg-[#272727] transition-colors group"
              >
                <span className="text-gray-800 dark:text-[#f1f1f1] mr-4">
                  {link.icon}
                </span>
                <span className="text-sm font-medium text-gray-800 dark:text-[#f1f1f1]">
                  {link.name}
                </span>
              </Link>
            ))}
          </div>
          <SubscribesList/>

          {/* Secondary Links (You) */}
          <div className="py-3 border-b border-gray-100 dark:border-[#272727]">
            <Link
              to="/"
              className="flex items-center px-4 py-2.5 mx-3 rounded-xl hover:bg-gray-100 dark:hover:bg-[#272727] transition-colors group mb-1"
            >
              <span className="text-base font-semibold text-gray-900 dark:text-white mr-2">
                You
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4 text-gray-600 dark:text-[#aaaaaa]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </Link>
            {secondaryLinks.map((link, index) => (
              <Link
                key={index}
                to={link.to}
                className="flex items-center px-4 py-2.5 mx-3 rounded-xl hover:bg-gray-100 dark:hover:bg-[#272727] transition-colors group"
              >
                <span className="text-gray-800 dark:text-[#f1f1f1] mr-4">
                  {link.icon}
                </span>
                <span className="text-sm font-medium text-gray-800 dark:text-[#f1f1f1]">
                  {link.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-[#0f0f0f] border-t border-gray-200 dark:border-[#272727] flex justify-around items-center h-14 z-50 pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        {mobileNavLinks.map((link, index) => (
          <Link
            key={index}
            to={link.to}
            className="flex flex-col items-center justify-center w-full h-full text-gray-700 dark:text-[#f1f1f1] hover:text-black dark:hover:text-white"
          >
            <span className="mb-1 [&>svg]:w-6 [&>svg]:h-6">{link.icon}</span>
            <span className="text-[10px] font-medium">{link.name}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}