import { LogoutApi } from "@/client/user.api";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  HiOutlineArrowRightOnRectangle
} from "react-icons/hi2";
import { useUserStore } from "@/store/useUserStore";

interface ProfileMenuProps {
  onClose?: () => void;
}

const ProfileMenu = ({ onClose }: ProfileMenuProps) => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  const handleLogoutClick = async () => {
    if (onClose) onClose();
    try {
      await LogoutApi();
    } catch (e) {
      alert("Already logged out");
    } finally {
      navigate({
        to: "/Login",
        replace: true,
      });
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#282828] rounded-xl shadow-lg border border-gray-100 dark:border-[#3f3f3f] py-2 z-50">
      <div className="px-4 py-3 flex items-center border-b border-gray-100 dark:border-[#3f3f3f]">
        <img
          src={user?.avatar}
          alt="User Avatar"
          className="w-10 h-10 rounded-full mr-3 object-cover"
        />
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-[#f1f1f1]">
            {user?.username}
          </p>
          <p className="text-xs text-gray-500 dark:text-[#aaaaaa]">{user?.email}</p>
          <Link
            to="/$userId"
            params={{ userId: user?.username! }}
            onClick={onClose}
            className="text-sm text-blue-600 dark:text-[#3ea6ff] mt-1 inline-block font-medium hover:underline"
          >
            View your channel
          </Link>
        </div>
      </div>

      <div className="py-2 border-b border-gray-100 dark:border-[#3f3f3f]">
        <button
          onClick={handleLogoutClick}
          className="w-full flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#3f3f3f] transition-colors text-left"
        >
          <HiOutlineArrowRightOnRectangle className="w-5 h-5 mr-4 text-gray-700 dark:text-[#f1f1f1]" />
          <span className="text-sm text-gray-800 dark:text-[#f1f1f1]">
            Sign out
          </span>
        </button>
      </div>
    </div>
  );
};

export default ProfileMenu;
