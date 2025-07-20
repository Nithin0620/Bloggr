import { React, useEffect, useState, useRef } from "react";
import { FaPlus } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import { FaAngleDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";
import { usePageStore } from "../store/PageStore";
import ProfileDropDown from "./ProfileDropDown";
import { toast } from "react-hot-toast";
import CreatePostHandler from "./CreatePostHandler";
import { usePostStore } from "../store/PostStore";

const Navbar = () => {
  const dropdownRef = useRef();
  const { token, authUser } = useAuthStore();
  const navigate = useNavigate();
  const { currentPage, setCurrentPage, setIsCreatePostOpen,isCreatePostOpen } = usePageStore();
  // const { } = usePostStore();

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
    setCurrentPage("createPost");
    setIsCreatePostOpen(true);
    // navigate("/create");
  };

  const handleOnClickForNavigate = (page) => {
    setCurrentPage(page);
    navigate(page === "home" ? "/" : `/${page}`);
  };

  return (
    <div>
    <div className="min-w-full flex items-center justify-between px-6 py-3 top-0 sticky z-50 transition-colors duration-300 accent-text-mode accent-bg-mode  accent-box-shadow shadow-sm ">
      <div
        onClick={() => handleOnClickForNavigate("home")}
        className="flex items-center space-x-2 cursor-pointer accent-text  transition"
      >
        <svg
          className="w-8 h-8 accent-text"
          fill="currentColor"
          viewBox="0 0 48 48"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z"></path>
        </svg>
        <h1 className="text-xl font-bold tracking-wide">Bloggr</h1>
      </div>

      <div className="flex items-center transition-all duration-500 space-x-6">
        <div
          onClick={handleCreatePostClick}
          className="flex items-center space-x-2 cursor-pointer hover:scale-105 transition rounded-3xl p-[0.15rem] accent-highlight accent-shadow"
        >
          <FaPlus className="text-base" />
          <span
            
            className="text-sm font-medium"
          >
            Create Post
          </span>
        </div>

        <div>
          {!token ? (
            <div
              onClick={() => handleOnClickForNavigate("login")}
              className={`text-sm font-medium hover:scale-105 ${
                currentPage === "login" ? "accent-text" : ""
              } duration-300 hover:translate-y-[-0.15rem] accent-underline cursor-pointer `}
            >
              Log in
            </div>
          ) : (
            <IoSettingsOutline
              onClick={() => handleOnClickForNavigate("settings")}
              className={`cursor-pointer text-xl hover:scale-105 transition ${
                currentPage === "settings"
                  ? "accent-text rotate-90 ease-in-out transition-all duration-300"
                  : ""
              }`}
            />
          )}
        </div>

        <div>
          {!token ? (
            <div
              onClick={() => handleOnClickForNavigate("signup")}
              className={`text-sm font-medium cursor-pointer hover:scale-105 ${
                currentPage === "signup" ? "accent-text" : ""
              } duration-300 hover:translate-y-[-0.15rem]  accent-underline `}
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
                src={authUser.profilePic || "https://via.placeholder.com/32"}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover  border border-gray-400"
              />
              <FaAngleDown
                className={`transition-transform duration-500 animate-[wiggle_3s_ease-in-out_infinite] ${
                  openProfileDropDown ? "rotate-180" : ""
                }`}
              />
              {openProfileDropDown && (
                <div className="absolute right-0 top-full accent-underline mt-2 z-10">
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
    {isCreatePostOpen && (
        <div className="z-50 ">
          <CreatePostHandler />
        </div>
    )}
    </div>
  );
};

export default Navbar;
