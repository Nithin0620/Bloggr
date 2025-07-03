import React from "react";
import { FaPlus } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import { useAuthStore } from "../store/AuthStore";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import ProfileDropDown from "./ProfileDropDown";

const Navbar = () => {
  const token = useAuthStore();
  const navigate = useNavigate();

  const [openProfileDropDown, setOpenProfileDropDown] = useState(false);

  const image = authUser.profileImage;

  const handleCreatePostClick = ()=>{
    if(token === null){
      toast.error("Login to create New Post");
      return;
    }


  }

  return (
    <div className="flex flex-row justify-end w-11/12">
      <div>
        <svg
          fill="currentColor"
          viewBox="0 0 48 48"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z"></path>
        </svg>
        <h1>Bloggr</h1>
      </div>

      <div>
        <div onClick={handleCreatePostClick}>
          <FaPlus />
          Create Post
        </div>
        <div>
          {token === null ? (
            <div onClick={navigate("/login")}>Log in</div>
          ) : (
            <div>
              <IoSettingsOutline />
            </div>
          )}
        </div>
        <div>
          {token === null ? (
            <div onClick={navigate("/signup")}>Sign up</div>
          ) : (
            <div
              onClick={() => setOpenProfileDropDown(true)}
              className="relative flex items-center space-x-2 cursor-pointer"
            >
              <img
                src={image}
                alt=""
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
