import { React, useEffect, useState, useRef } from "react";
import { FaPlus } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import { FaAngleDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";
import { usePageStore } from "../store/PageStore";
import ProfileDropDown from "./ProfileDropDown";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const dropdownRef = useRef();
  const { token, profilePic } = useAuthStore();
  const navigate = useNavigate();
  const { currentPage, setCurrentPage } = usePageStore.getState();

  const [openProfileDropDown, setOpenProfileDropDown] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenProfileDropDown(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleCreatePostClick = () => {
    if (!token) {
      toast.error("Login to create New Post");
      return;
    }
    navigate("/create");
  };

  const handleOnClickForNavigate = (page) => {
    setCurrentPage(page);
    navigate(page === "home" ? "/" : `/${page}`);
  };

  return (
    <div className="flex items-center justify-between px-6 py-3 sticky top-0 z-50 bg-white/90 backdrop-blur-md accent-box-shadow shadow-sm rounded-b-xl">
      {/* Left: Logo */}
      <div
        onClick={() => handleOnClickForNavigate("home")}
        className="flex items-center space-x-2 cursor-pointer hover:scale-105 transition"
      >
        <svg
          className="w-8 h-8 text-black"
          fill="currentColor"
          viewBox="0 0 48 48"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z"></path>
        </svg>
        <h1 className="text-xl font-bold tracking-wide">Bloggr</h1>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center space-x-6">
        {/* Create Post */}
        <div
          onClick={handleCreatePostClick}
          className="flex items-center space-x-2 cursor-pointer hover:scale-105 transition accent-text"
        >
          <FaPlus className="text-base" />
          <span className="text-sm font-medium">Create Post</span>
        </div>

        {/* Settings or Login */}
        <div>
          {!token ? (
            <div
              onClick={() => handleOnClickForNavigate("login")}
              className="text-sm font-medium hover:scale-105 duration-200 hover:translate-y-[-0.15rem] accent-underline cursor-pointer "
            >
              Log in
            </div>
          ) : (
            <IoSettingsOutline
              onClick={() => handleOnClickForNavigate("settings")}
              className="cursor-pointer text-xl hover:scale-105 transition"
            />
          )}
        </div>

        {/* Signup or Profile */}
        <div>
          {!token ? (
            <div
              onClick={() => handleOnClickForNavigate("signup")}
              className="text-sm font-medium cursor-pointer hover:scale-105 duration-200 hover:translate-y-[-0.15rem]  accent-underline "
            >
              Sign up
            </div>
          ) : (
            <div
              onClick={() => setOpenProfileDropDown(!openProfileDropDown)}
              className="relative flex items-center space-x-2 cursor-pointer"
              ref={dropdownRef}
            >
              <img
                src={profilePic || "https://via.placeholder.com/32"}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover  border border-gray-400"
              />
              <FaAngleDown
                className={`transition-transform duration-200 animate-[wiggle_3s_ease-in-out_infinite] ${
                  openProfileDropDown ? "rotate-180" : ""
                }`}
              />
              {openProfileDropDown && (
                <div className="absolute right-0 top-full accent-underline mt-2 z-10">
                  <ProfileDropDown setOpenProfileDropDown={setOpenProfileDropDown} />
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
