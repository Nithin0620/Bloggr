import { useAuthStore } from '../store/AuthStore';
import { TbLogout2 } from "react-icons/tb";
import { IoMdShare } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProfileDropDown = ({ setOpenProfileDropDown }) => {
  const { authUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    setOpenProfileDropDown(false);
    navigate("/login");
  };

  const handleViewProfile = () => {
    setOpenProfileDropDown(false);
    navigate("/myprofile");
  };

  const handleShareProfile = () => {
    toast("Profile link copied!");
    // navigator.clipboard.writeText(`https://yourapp.com/user/${authUser.username}`);
  };

  return (
    <div className="absolute right-0 mt-0 w-44 rounded-xl border shadow-lg accent-box-shadow z-50 animate-fade-in transition-colors duration-300 accent-bg-mode accent-text-mode">
      {/* Email */}
      <div className="px-4 py-2 text-sm font-medium  border-b truncate">
        {authUser?.email || "No email"}
      </div>

      {/* Share Profile */}
      <div
        onClick={handleShareProfile}
        className="px-4 py-2 flex items-center gap-2 text-sm cursor-pointer hover:font-semibold"
      >
        <IoMdShare />
        Share my profile
      </div>

      {/* View Profile */}
      <div
        onClick={handleViewProfile}
        className="flex items-center px-4 py-2 gap-2 hover:border-0 rounded-xl transition-all duration-200 cursor-pointer"
      >
        <img
          src={authUser?.profilePic || "https://via.placeholder.com/32"}
          alt="profile"
          className="w-5 h-5 rounded-full object-cover"
        />
        <span className="text-sm">View Profile</span>
      </div>

      {/* Logout */}
      <div
        onClick={handleLogout}
        className="border-t mt-1 px-4 py-2 flex items-center gap-2 text-sm text-red-600 cursor-pointer hover:bg-red-50"
      >
        <TbLogout2 className="text-lg ml-1" />
        Log Out
      </div>
    </div>
  );
};

export default ProfileDropDown;
