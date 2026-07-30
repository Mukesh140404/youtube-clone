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

          {/* Subscriptions */}
          {/* <div className="py-3 border-b border-gray-100 dark:border-[#272727]">
            <div className="px-5 py-2">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                Subscriptions
              </h3>
            </div>
            {subscriptions.map((sub, index) => (
              <Link
                key={index}
                to="/$userId"
                params={{ userId: sub.userId }}
                className="flex items-center px-4 py-2 mx-3 rounded-xl hover:bg-gray-100 dark:hover:bg-[#272727] transition-colors group"
              >
                <img
                  src={sub.avatar}
                  alt={sub.name}
                  className={`w-6 h-6 rounded-full mr-4 border ${sub.isActive ? 'border-blue-500 p-px' : 'border-gray-200 dark:border-[#3f3f3f]'}`}
                />
                <span className={`text-sm font-medium truncate ${sub.isActive ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-[#aaaaaa]'}`}>
                  {sub.name}
                </span>
                {sub.isActive && (
                  <span className="w-1 h-1 bg-blue-600 rounded-full ml-auto"></span>
                )}
              </Link>
            ))}
            <button className="flex items-center px-4 py-2.5 mx-3 w-[calc(100%-24px)] rounded-xl hover:bg-gray-100 dark:hover:bg-[#272727] transition-colors group text-gray-800 dark:text-[#f1f1f1]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 mr-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
              <span className="text-sm font-medium">Show more</span>
            </button>
          </div> */}
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

          {/* Settings / Extra */}
          {/* <div className="py-3 border-b border-gray-100 dark:border-[#272727]">
            <Link
              to="/"
              className="flex items-center px-4 py-2.5 mx-3 rounded-xl hover:bg-gray-100 dark:hover:bg-[#272727] transition-colors group"
            >
              <span className="text-gray-800 dark:text-[#f1f1f1] mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </span>
              <span className="text-sm font-medium text-gray-800 dark:text-[#f1f1f1]">
                Settings
              </span>
            </Link>
            <Link
              to="/"
              className="flex items-center px-4 py-2.5 mx-3 rounded-xl hover:bg-gray-100 dark:hover:bg-[#272727] transition-colors group"
            >
              <span className="text-gray-800 dark:text-[#f1f1f1] mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5"
                  />
                </svg>
              </span>
              <span className="text-sm font-medium text-gray-800 dark:text-[#f1f1f1]">
                Report history
              </span>
            </Link>
            <Link
              to="/"
              className="flex items-center px-4 py-2.5 mx-3 rounded-xl hover:bg-gray-100 dark:hover:bg-[#272727] transition-colors group"
            >
              <span className="text-gray-800 dark:text-[#f1f1f1] mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                  />
                </svg>
              </span>
              <span className="text-sm font-medium text-gray-800 dark:text-[#f1f1f1]">
                Help
              </span>
            </Link>
          </div> */}

          {/* <div className="px-6 py-4 text-xs text-gray-500 dark:text-[#aaaaaa] font-medium">
            <p className="mb-2">
              About Press Copyright Contact us Creators Advertise Developers
            </p>
            <p className="mb-4">
              Terms Privacy Policy & Safety How YouTube works Test new features
            </p>
            <p className="text-gray-400 dark:text-[#717171]">
              © 2024 Google LLC
            </p>
          </div> */}
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