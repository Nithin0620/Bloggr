import React from "react";
import { RiProfileLine } from "react-icons/ri";
import { useAuthStore } from "../store/AuthStore";
import { BsPostcard } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { UserCheck, UserPlus } from "lucide-react";

const EditProfileRight = () => {
  const { authUser,setIsLogoutModalOpen } = useAuthStore();
  const navigate = useNavigate();

  const logoutHandler = () => {
      setIsLogoutModalOpen(true)
   };

  return (
    <div className="p-4 shadow-accent-box rounded-xl space-y-6 transition-colors duration-300 accent-text-mode accent-bg-mode">
      <h1 className="text-lg font-bold flex items-center gap-2">
        <RiProfileLine /> Profile Summary
      </h1>
      <div className="space-y-2">
        <p className="flex items-center gap-2">
          <UserCheck /> Followers Count:
        </p>
        <h1 className="text-xl font-semibold">{authUser.profile.followers.length}</h1>

        <p className="flex items-center gap-2">
          <UserPlus /> Following Count:
        </p>
        <h1 className="text-xl font-semibold">{authUser.profile.following.length}</h1>

        <p className="flex items-center gap-2">
          <BsPostcard /> Total Posts:
        </p>
        <h1 className="text-xl font-semibold">{authUser.profile.posts.length}</h1>
      </div>

      <div onClick={() => navigate("/profile")} className="cursor-pointer underline accent-underline">
        View My Profile
      </div>

      <div
        onClick={logoutHandler}
        className="bg-red-600 hover:scale-95 transition-all duration-200 flex items-center justify-center gap-3 text-yellow-50 hover:text-amber-100 cursor-pointer font-semibold px-4 py-2 border rounded-3xl hover:shadow w-full"
      >
        <BiLogOut className="text-xl" />
        Logout
      </div>
    </div>
  );
};

export default EditProfileRight;
