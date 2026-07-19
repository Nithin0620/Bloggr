import {React,useEffect, useState} from 'react'
import { IoHomeOutline, IoHomeSharp, IoChatbubbleEllipsesOutline, IoChatbubbleEllipses } from "react-icons/io5"
import { IoIosNotificationsOutline } from "react-icons/io"
import { IoMdNotifications } from "react-icons/io"
import { RiGlobeLine, RiGlobeFill } from "react-icons/ri";
import toast from 'react-hot-toast';
import { usePageStore } from '../store/PageStore'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/AuthStore';

const tabs = [
  { id: "home", label: "Home", iconOutline: IoHomeOutline, iconFilled: IoHomeSharp },
  { id: "Explore", label: "Explore", iconOutline: RiGlobeLine, iconFilled: RiGlobeFill },
  { id: "notification", label: "Alerts", iconOutline: IoIosNotificationsOutline, iconFilled: IoMdNotifications },
  { id: "message", label: "Chat", iconOutline: IoChatbubbleEllipsesOutline, iconFilled: IoChatbubbleEllipses },
];

const Footbar = () => {
  const { currentPage, setCurrentPage } = usePageStore();
  const {token,authUser}  = useAuthStore();
  const navigate = useNavigate();
  const [hoveredTab, setHoveredTab] = useState(null);

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

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-11/12 max-w-md z-40 transition-all duration-300 accent-text-mode">
      <div className="flex justify-evenly h-12 rounded-full gap-5 px-6 py-0 backdrop-blur-3xl shadow-accent-box border accent-border">
        {tabs.map((tab) => {
          const isActive = currentPage === tab.id;
          const isHovered = hoveredTab === tab.id;
          const Icon = isActive ? tab.iconFilled : tab.iconOutline;

          return (
            <div
              key={tab.id}
              onClick={() => handleClickInBar(tab.id)}
              onMouseEnter={() => setHoveredTab(tab.id)}
              onMouseLeave={() => setHoveredTab(null)}
              className="relative w-[25%] py-2 cursor-pointer transition-all duration-1000 ease-in-out"
            >
              <div
                className={`flex items-center justify-center transition-all duration-100 ease-in-out font-bold text-xl ${
                  isActive ? "accent-text" : ""
                }`}
              >
                <Icon className={tab.id === "Explore" ? "font-extralight" : ""} />
              </div>
              <div
                className={`flex items-center justify-center font-[475] text-xs mt-1 ${
                  isActive ? "accent-text" : ""
                }`}
              >
                {tab.label}
              </div>
              <div
                className={`h-[2px] z-[-10px] mt-1 rounded-full transition-all ease-in-out duration-500 ${
                  isActive
                    ? "opacity-100 scale-100 accent-bg"
                    : "opacity-0 scale-0"
                }`}
              />

              {/* Tooltip */}
              {isHovered && !isActive && (
                <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg bg-gray-900 text-white text-[0.65rem] font-medium whitespace-nowrap shadow-lg pointer-events-none animate-in fade-in duration-150">
                  {tab.id === "home" && "Go to Home feed"}
                  {tab.id === "Explore" && "Discover new content"}
                  {tab.id === "notification" && "View your notifications"}
                  {tab.id === "message" && "Open your chats"}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45 -mt-1" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Footbar;
