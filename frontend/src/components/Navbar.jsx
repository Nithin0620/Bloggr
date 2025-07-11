import { React, useEffect, useState,useRef } from "react";
import { FaPlus } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import { useAuthStore } from "../store/AuthStore";
import { FaAngleDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ProfileDropDown from "./ProfileDropDown";
import { toast } from "react-hot-toast";
import { usePageStore } from "../store/PageStore";

const Navbar = () => {
  const dropdownRef = useRef();
  useEffect(()=>{
    
    const handleOutsideClick = (event)=>{
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenProfileDropDown(false);
      }
    }
    document.addEventListener("mousedown",handleOutsideClick)
  },[])

  const { token,  } = useAuthStore();
  const navigate = useNavigate();

  const {currentPage,setCurrentPage} = usePageStore.getState();

  const [openProfileDropDown, setOpenProfileDropDown] = useState(false);

  var image;

  const handleCreatePostClick = () => {
    if (token === null) {
      toast.error("Login to create New Post");
      return;
    }
  };

  const handleOnClickForNavigate = (page)=>{
    setCurrentPage(`${page}`)
    console.log(currentPage);
    if(page === "home") navigate("/")
    else navigate(`/${page}`)
  }

  return (
    <div className="flex items-center justify-between px-6 py-3 shadow-md bg-white sticky top-0 z-50">
      {/* Left: Logo */}
      <div onClick={()=>handleOnClickForNavigate("home")} className="flex items-center space-x-2 cursor-pointer">
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
              onClick={()=>handleOnClickForNavigate("login")}
              className="text-sm font-medium cursor-pointer hover:underline"
            >
              Log in
            </div>
          ) : (
            <div onClick={()=>handleOnClickForNavigate("settings")} className="cursor-pointer hover:scale-105 transition">
              <IoSettingsOutline className="text-xl" />
            </div>
          )}
        </div>

        {/* Signup or Profile */}
        <div>
          {token !== null ? (
            <div
              onClick={()=>handleOnClickForNavigate("signup")}
              className="text-sm font-medium cursor-pointer hover:underline"
            >
              Sign up
            </div>
          ) : (
            <div
              onClick={() => setOpenProfileDropDown(!openProfileDropDown)}
              className="relative flex  items-center space-x-2 cursor-pointer"
              ref={dropdownRef}
            >
              <img
                src={image}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border border-gray-400 "
              />
              <FaAngleDown  className={`transition-transform duration-200 animate-[wiggle_3s_ease-in-out_infinite] ${openProfileDropDown ? "rotate-180" : ""}`}/>
              {openProfileDropDown && (
                <div className="absolute right-0  top-full mt-1 z-10 " >
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
