import React from 'react'
import { IoHomeOutline, IoHomeSharp, IoSearch, IoChatbubbleEllipsesOutline, IoChatbubbleEllipses } from "react-icons/io5"
import { IoIosSearch, IoIosNotificationsOutline } from "react-icons/io"
import { IoMdNotifications } from "react-icons/io"

import { usePageStore } from '../store/PageStore'

const Footbar = () => {
  const { currentPage, setCurrentPage } = usePageStore();

  const tabClass = (page) => `w-[25%] py-2 cursor-pointer transition-all duration-200 ease-in-out`

  const iconWrapper = `flex items-center justify-center font-bold text-xl`
  const labelWrapper = `flex items-center justify-center font-[475] text-xs mt-1`
  const underline = (page) => `h-[2px] z-[-10px] mt-1 rounded-full transition-all duration-300 ${currentPage === page ? "opacity-100 scale-100 bg-black" : "opacity-0 scale-0"}`

  return (
    <div className='fixed bottom-4 left-1/2 -translate-x-1/2 w-11/12 gap-5 max-w-md z-50'>
      <div className='flex justify-evenly h-16 rounded-full gap-14 bg-white shadow-[0px_17px_49px_-21px_rgba(0,_0,_0,_0.7)] px-6 py-0'>
        
        <div onClick={() => setCurrentPage("homePage")} className={tabClass("homePage")}>
          <div className={iconWrapper}>{currentPage === "homePage" ? <IoHomeSharp /> : <IoHomeOutline />}</div>
          <div className={labelWrapper}>Home</div>
          <div className={underline("homePage")}></div>
        </div>

        <div onClick={() => setCurrentPage("searchPage")} className={tabClass("searchPage")}>
          <div className={iconWrapper}>{currentPage === "searchPage" ? <IoSearch /> : <IoIosSearch />}</div>
          <div className={labelWrapper}>Search</div>
          <div className={underline("searchPage")}></div>
        </div>

        <div onClick={() => setCurrentPage("notificationPage")} className={tabClass("notificationPage")}>
          <div className={iconWrapper}>{currentPage === "notificationPage" ? <IoMdNotifications /> : <IoIosNotificationsOutline />}</div>
          <div className={labelWrapper}>Notification</div>
          <div className={underline("notificationPage")}></div>
        </div>

        <div onClick={() => setCurrentPage("messagePage")} className={tabClass("messagePage")}>
          <div className={iconWrapper}>{currentPage === "messagePage" ? <IoChatbubbleEllipses /> : <IoChatbubbleEllipsesOutline />}</div>
          <div className={labelWrapper}>Message</div>
          <div className={underline("messagePage")}></div>
        </div>
        
      </div>
    </div>
  )
}

export default Footbar
