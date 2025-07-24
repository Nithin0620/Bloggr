import {React,useEffect} from 'react'
import { IoHomeOutline, IoHomeSharp, IoSearch, IoChatbubbleEllipsesOutline, IoChatbubbleEllipses } from "react-icons/io5"
import { IoIosSearch, IoIosNotificationsOutline } from "react-icons/io"
import { IoMdNotifications } from "react-icons/io"
import { RiGlobeLine } from "react-icons/ri";
import { RiGlobeFill } from "react-icons/ri";

import { usePageStore } from '../store/PageStore'
import { useNavigate } from 'react-router-dom'
const Footbar = () => {
  const { currentPage, setCurrentPage } = usePageStore();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Current Page updated:", currentPage);
  }, [currentPage]);

  const handleClickInBar = (page) => {
    setCurrentPage(`${page}`);
    if (page === "home") navigate("/");
    else navigate(`/${page}`);
  };

  const tabClass = (page) =>
    `w-[25%] py-2 cursor-pointer transition-all duration-1000 ease-in-out`;

  const iconWrapper = (page) =>
    `flex  items-center justify-center transition-all duration-100 ease-in-out font-bold text-xl ${currentPage === page ? 'accent-text' : ''}`;

  const labelWrapper = (page) =>
    `flex items-center justify-center font-[475] text-xs mt-1 ${currentPage === page ? 'accent-text' : ''}`;

  const underline = (page) =>
    `h-[2px] z-[-10px] mt-1 rounded-full transition-all ease-in-out duration-500 ${
    currentPage === page ? "opacity-100 scale-100 accent-bg" : "opacity-0 scale-0"
  }`;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-11/12 gap-5  max-w-md z-40 transition-all duration-300 accent-text-mode">
      <div className="flex justify-evenly h-12 rounded-full gap-14 px-6 py-0 backdrop-blur-3xl opacity-99 shadow-accent-box  border border-gray-200">
        
        {/* Home */}
        <div onClick={() => handleClickInBar("home")} className={tabClass("home")}>
          <div className={iconWrapper("home")}>
            {currentPage === "home" ? <IoHomeSharp /> : <IoHomeOutline />}
          </div>
          <div className={labelWrapper("home")}>Home</div>
          <div className={underline("home")}></div>
        </div>

        {/* Search */}
        <div onClick={() => handleClickInBar("Explore")} className={tabClass("Explore")}>
          <div className={iconWrapper("Explore")}>
            {currentPage === "Explore" ? <RiGlobeFill/> : <RiGlobeLine  className='font-extralight '/>}
          </div>
          <div className={labelWrapper("Explore")}>Explore</div>
          <div className={underline("Explore")}></div>
        </div>

        {/* Notifications */}
        <div onClick={() => handleClickInBar("notification")} className={tabClass("notification")}>
          <div className={iconWrapper("notification")}>
            {currentPage === "notification" ? <IoMdNotifications /> : <IoIosNotificationsOutline />}
          </div>
          <div className={labelWrapper("notification")}>Notification</div>
          <div className={underline("notification")}></div>
        </div>

        {/* Messages */}
        <div onClick={() => handleClickInBar("message")} className={tabClass("message")}>
          <div className={iconWrapper("message")}>
            {currentPage === "message" ? <IoChatbubbleEllipses /> : <IoChatbubbleEllipsesOutline />}
          </div>
          <div className={labelWrapper("message")}>Message</div>
          <div className={underline("message")}></div>
        </div>
      </div>
    </div>
  );
};

export default Footbar;
