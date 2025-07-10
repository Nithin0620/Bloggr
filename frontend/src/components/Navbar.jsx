import { React, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import { useAuthStore } from "../store/AuthStore";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ProfileDropDown from "./ProfileDropDown";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const { token,  } = useAuthStore();
  const navigate = useNavigate();

  const [openProfileDropDown, setOpenProfileDropDown] = useState(false);

  var image;

  const handleCreatePostClick = () => {
    if (token === null) {
      toast.error("Login to create New Post");
      return;
    }
  };

  return (
    <div className="flex items-center justify-between px-6 py-3 shadow-md bg-white sticky top-0 z-50">
      {/* Left: Logo */}
      <div onClick={()=>navigate("/")} className="flex items-center space-x-2 cursor-pointer">
        <svg
          className="w-8 h-8 text-black"
          fill="currentColor"
          viewBox="0 0 48 48"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z"></path>
        </svg>
        <h1 className="text-xl font-bold">Bloggr</h1>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center space-x-6">
        {/* Create Post */}
        <div
          onClick={handleCreatePostClick}
          className="flex items-center space-x-2 cursor-pointer hover:scale-105 transition"
        >
          <FaPlus className="text-base" />
          <span className="text-sm font-medium">Create Post</span>
        </div>

        {/* Settings or Login */}
        <div>
          {token === null ? (
            <div
              onClick={() => navigate("/login")}
              className="text-sm font-medium cursor-pointer hover:underline"
            >
              Log in
            </div>
          ) : (
            <div className="cursor-pointer hover:scale-105 transition">
              <IoSettingsOutline className="text-xl" />
            </div>
          )}
        </div>

        {/* Signup or Profile */}
        <div>
          {token === null ? (
            <div
              onClick={() => navigate("/signup")}
              className="text-sm font-medium cursor-pointer hover:underline"
            >
              Sign up
            </div>
          ) : (
            <div
              onClick={() => setOpenProfileDropDown(true)}
              className="relative flex items-center space-x-2 cursor-pointer"
            >
              <img
                src={image}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border border-gray-400"
              />
              {openProfileDropDown ? <FaAngleUp /> : <FaAngleDown />}
              {openProfileDropDown && (
                <div className="absolute right-0 top-full mt-2 z-10">
                  <ProfileDropDown
                    setOpenProfileDropDown={setOpenProfileDropDown}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
