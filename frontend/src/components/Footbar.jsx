import {React,useEffect} from 'react'
import { IoHomeOutline, IoHomeSharp, IoSearch, IoChatbubbleEllipsesOutline, IoChatbubbleEllipses } from "react-icons/io5"
import { IoIosSearch, IoIosNotificationsOutline } from "react-icons/io"
import { IoMdNotifications } from "react-icons/io"

import { usePageStore } from '../store/PageStore'
import { useNavigate } from 'react-router-dom'

const Footbar = () => {
  const { currentPage, setCurrentPage } = usePageStore();
  const navigate = useNavigate();
  // const currentPage = usePageStore((state) => state.currentPage);

  useEffect(() => {
    console.log("Current Page updated:", currentPage);
  }, [currentPage]);

  const tabClass = (page) => `w-[25%] py-2 cursor-pointer transition-all duration-200 ease-in-out`

  const iconWrapper = `flex items-center justify-center font-bold text-xl`
  const labelWrapper = `flex items-center justify-center font-[475] text-xs mt-1`
  const underline = (page) => `h-[2px] z-[-10px] mt-1 rounded-full transition-all duration-300 ${currentPage === page ? "opacity-100 scale-100 bg-black" : "opacity-0 scale-0"}`

  const handleClickInBar = (page)=>{
    setCurrentPage(`${page}`);
    console.log(currentPage);
    if(page === "home") navigate("/")
    else navigate(`/${page}`)
    
  }

  return (
    <div className='fixed bottom-4 left-1/2 -translate-x-1/2 w-11/12 gap-5 max-w-md z-50'>
      <div className='flex justify-evenly h-16 rounded-full gap-14 bg-white shadow-[0px_17px_49px_-21px_rgba(0,_0,_0,_0.7)] px-6 py-0'>
        
        <div onClick={()=>handleClickInBar("home")} className={tabClass("home")}>
          <div className={iconWrapper}>{currentPage === "home" ? <IoHomeSharp /> : <IoHomeOutline />}</div>
          <div className={labelWrapper}>Home</div>
          <div className={underline("home")}></div>
        </div>

        <div onClick={()=>handleClickInBar("search")} className={tabClass("search")}>
          <div className={iconWrapper}>{currentPage === "search" ? <IoSearch /> : <IoIosSearch />}</div>
          <div className={labelWrapper}>Search</div>
          <div className={underline("search")}></div>
        </div>

        <div onClick={()=>handleClickInBar("notification")} className={tabClass("notification")}>
          <div className={iconWrapper}>{currentPage === "notification" ? <IoMdNotifications /> : <IoIosNotificationsOutline />}</div>
          <div className={labelWrapper}>Notification</div>
          <div className={underline("notification")}></div>
        </div>

        <div onClick={()=>handleClickInBar("message")} className={tabClass("message")}>
          <div className={iconWrapper}>{currentPage === "message" ? <IoChatbubbleEllipses /> : <IoChatbubbleEllipsesOutline />}</div>
          <div className={labelWrapper}>Message</div>
          <div className={underline("message")}></div>
        </div>
        
      </div>
    </div>
  )
}

export default Footbar
