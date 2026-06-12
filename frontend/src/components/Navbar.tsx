import { useState, useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import ProfileMenu from "./ProfileMenu";
import { useUserStore } from "@/store/useUserStore";

// React Icons Imports
import {
  HiOutlineMenu,
  HiOutlineSearch,
  // HiMicrophone,
  HiOutlineVideoCamera,
  // HiOutlineBell,
  HiOutlineSun,
  HiOutlineMoon
} from "react-icons/hi";
import { FaYoutube } from "react-icons/fa";
import AddVideoModal from "./modal/AddVideoModal";

interface NavbarProps {
  toggleSidebar: () => void;
}

export default function Navbar({ toggleSidebar }: NavbarProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const user = useUserStore((state) => state.user);


  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newTheme = !prev;
      if (newTheme) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return newTheme;
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white dark:bg-[#0f0f0f] px-4 h-16 flex items-center justify-between transition-colors duration-200">

      {/* Left: Logo & Menu */}
      <div className="flex items-center gap-4 md:w-1/4">
        <button
          onClick={toggleSidebar}
          className="hidden md:flex p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#272727] transition-colors"
        >
          <HiOutlineMenu className="w-6 h-6 text-gray-700 dark:text-[#f1f1f1]" />
        </button>

        <Link to="/" className="flex items-center gap-1 group">
          <FaYoutube className="w-8 h-8 text-[#FF0000]" />
          <span className="text-xl font-bold tracking-tighter text-gray-900 dark:text-white hidden sm:block">
            YouTube
          </span>
        </Link>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-2xl px-4 flex items-center justify-center">
        <form onSubmit={handleSearch} className="flex w-full max-w-150 items-center">
          <div className="flex w-full items-center border border-gray-300 dark:border-[#3f3f3f] rounded-l-full px-4 py-2 bg-gray-50 dark:bg-[#121212] focus-within:bg-white dark:focus-within:bg-[#0f0f0f] focus-within:border-blue-500 transition-all shadow-inner">
            <HiOutlineSearch className="w-5 h-5 text-gray-400 mr-2 hidden sm:block" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500"
            />
          </div>

          <button
            type="submit"
            className="border border-l-0 border-gray-300 dark:border-[#3f3f3f] bg-gray-50 dark:bg-[#222222] px-5 py-2.5 rounded-r-full hover:bg-gray-100 dark:hover:bg-[#303030] transition-colors"
            title="Search"
          >
            <HiOutlineSearch className="w-5 h-5 text-gray-600 dark:text-[#f1f1f1]" />
          </button>

          {/* <button
            type="button"
            className="ml-4 p-2.5 bg-gray-50 dark:bg-[#181818] rounded-full hover:bg-gray-200 dark:hover:bg-[#303030] transition-colors hidden sm:block"
            title="Search with your voice"
          >
            <HiMicrophone className="w-5 h-5 text-gray-800 dark:text-[#f1f1f1]" />
          </button> */}
        </form>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center justify-end gap-2 md:w-1/4">
        <button
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#272727] transition-colors hidden sm:block"
          title="Create"
          onClick={()=>setIsUploadModalOpen(true)}
        >
          <HiOutlineVideoCamera className="w-6 h-6 text-gray-700 dark:text-[#f1f1f1]" />
        </button>

        {/* <button
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#272727] transition-colors hidden sm:block"
          title="Notifications"
        >
          <div className="relative">
            <HiOutlineBell className="w-6 h-6 text-gray-700 dark:text-[#f1f1f1]" />
            <span className="absolute top-0.5 right-0.5 block h-2 w-2 rounded-full bg-red-600 ring-2 ring-white dark:ring-[#0f0f0f]"></span>
          </div>
        </button> */}

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#272727] transition-colors"
          title={isDarkMode ? "Light Mode" : "Dark Mode"}
        >
          {isDarkMode ? (
            <HiOutlineSun className="w-6 h-6 text-gray-700 dark:text-[#f1f1f1]" />
          ) : (
            <HiOutlineMoon className="w-6 h-6 text-gray-700 dark:text-[#f1f1f1]" />
          )}
        </button>

        {/* Profile */}
        <div className="ml-2 relative cursor-pointer" ref={profileMenuRef}>
          <img
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            src={user?.avatar}
            alt="User Avatar"
            className="w-9 h-9 rounded-full border object-cover border-gray-200 dark:border-[#3f3f3f] hover:ring-2 hover:ring-gray-300 transition-all"
          />
          {isProfileMenuOpen && <ProfileMenu onClose={() => setIsProfileMenuOpen(false)} />}
        </div>
      </div>
      <AddVideoModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} userId={user?._id} />
    </nav>
  );
}