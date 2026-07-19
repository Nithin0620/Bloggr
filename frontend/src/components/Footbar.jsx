import {React,useEffect} from 'react'
import { IoHomeOutline, IoHomeSharp, IoChatbubbleEllipsesOutline, IoChatbubbleEllipses } from "react-icons/io5"
import { IoIosNotificationsOutline } from "react-icons/io"
import { IoMdNotifications } from "react-icons/io"
import { RiGlobeLine, RiGlobeFill } from "react-icons/ri";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import toast from 'react-hot-toast';
import { usePageStore } from '../store/PageStore'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/AuthStore';

const Footbar = () => {
  const { currentPage, setCurrentPage } = usePageStore();
  const {token,authUser}  = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {}, [currentPage]);

  const handleClickInBar = (page) => {
    if (page === "home") {
      setCurrentPage(`${page}`);
      navigate("/");
    }
    else {
      if(!token && !authUser){
        toast.error("Please first login yourself!")
        return;
      }
      else {
        setCurrentPage(`${page}`);
        navigate(`/${page}`);
      }
    }
  };

  const tabClass =
    `w-[20%] py-2 cursor-pointer transition-all duration-1000 ease-in-out`;

  const iconWrapper = (page) =>
    `flex items-center justify-center transition-all duration-100 ease-in-out font-bold text-xl ${currentPage === page ? 'accent-text' : ''}`;

  const labelWrapper = (page) =>
    `flex items-center justify-center font-[475] text-[0.65rem] mt-1 ${currentPage === page ? 'accent-text' : ''}`;

  const underline = (page) =>
    `h-[2px] z-[-10px] mt-1 rounded-full transition-all ease-in-out duration-500 ${
    currentPage === page ? "opacity-100 scale-100 accent-bg" : "opacity-0 scale-0"
  }`;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-11/12 max-w-md z-40 transition-all duration-300 accent-text-mode">
      <div className="flex justify-evenly h-12 rounded-full gap-1 px-4 py-0 backdrop-blur-3xl shadow-accent-box border border-gray-200">

        {/* Home */}
        <div onClick={() => handleClickInBar("home")} className={tabClass}>
          <div className={iconWrapper("home")}>
            {currentPage === "home" ? <IoHomeSharp /> : <IoHomeOutline />}
          </div>
          <div className={labelWrapper("home")}>Home</div>
          <div className={underline("home")}></div>
        </div>

        {/* Explore */}
        <div onClick={() => handleClickInBar("Explore")} className={tabClass}>
          <div className={iconWrapper("Explore")}>
            {currentPage === "Explore" ? <RiGlobeFill/> : <RiGlobeLine className='font-extralight'/>}
          </div>
          <div className={labelWrapper("Explore")}>Explore</div>
          <div className={underline("Explore")}></div>
        </div>

        {/* Bookmarks */}
        <div onClick={() => handleClickInBar("bookmarks")} className={tabClass}>
          <div className={iconWrapper("bookmarks")}>
            {currentPage === "bookmarks" ? <FaBookmark /> : <FaRegBookmark />}
          </div>
          <div className={labelWrapper("bookmarks")}>Saved</div>
          <div className={underline("bookmarks")}></div>
        </div>

        {/* Notifications */}
        <div onClick={() => handleClickInBar("notification")} className={tabClass}>
          <div className={iconWrapper("notification")}>
            {currentPage === "notification" ? <IoMdNotifications /> : <IoIosNotificationsOutline />}
          </div>
          <div className={labelWrapper("notification")}>Alerts</div>
          <div className={underline("notification")}></div>
        </div>

        {/* Messages */}
        <div onClick={() => handleClickInBar("message")} className={tabClass}>
          <div className={iconWrapper("message")}>
            {currentPage === "message" ? <IoChatbubbleEllipses /> : <IoChatbubbleEllipsesOutline />}
          </div>
          <div className={labelWrapper("message")}>Chat</div>
          <div className={underline("message")}></div>
        </div>
      </div>
    </div>
  );
};

export default Footbar;
