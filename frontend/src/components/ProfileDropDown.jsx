import { useAuthStore } from '../store/AuthStore'
import { TbLogout2 } from "react-icons/tb";
import { IoMdShare } from "react-icons/io";


const ProfileDropDown = () => {
  const { authUser } = useAuthStore();
  const firstName = "Nithin";

  return (
    <div className="absolute right-0 mt-0 w-40 rounded-lg shadow-md border bg-white z-50 animate-[wiggle_3s_ease-in-out_infinite]">
      {/* Email */}
      <div className="px-4 py-2 text-sm border-b">
        {/* {authUser.email} */}
        email
      </div>

      {/* Share Profile */}
      <div className="px-4 py-2 flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-100">
        <IoMdShare/>
        Share my profile
      </div>

      {/* View Profile */}
      <div className="flex items-center px-4 py-2 gap-3 hover:bg-gray-100 cursor-pointer">
        <img
          // src={authUser.profilePic}
          alt="profile"
          className="w-5 h-5 rounded-full object-cover"
        />
        <div className="text-sm">
          View Profile
        </div>
      </div>

      {/* Logout with top border and red text */}
      <div className="border-t mt-1 px-4 py-2 flex items-center gap-2 text-sm text-red-600 cursor-pointer hover:bg-gray-100">
        <TbLogout2 className="text-lg ml-1" />
        Log Out
      </div>
    </div>
  );
};

export default ProfileDropDown;
