import React, { useState } from 'react'
import {IoHomeOutline} from "react-icons/io5"
import {IoHomeSharp} from "react-icons/io5"
import {IoSearch} from "react-icons/io5"
import {IoIosSearch} from "react-icons/io"
import {IoIosNotificationsOutline} from "react-icons/io"
import {IoMdNotifications} from "react-icons/io"
import {IoChatbubbleEllipsesOutline} from "react-icons/io5"
import {IoChatbubbleEllipses} from "react-icons/io5"

import { usePageStore } from '../store/PageStore'


const Footbar = () => {
   const {currentPage,setCurrentPage} = usePageStore();

  return (
   <div>
    <div className='flex justify-center rounded-full w-10/12 hover:scale-110 z-50 shadow-[0px_17px_49px_-21px_rgba(0,_0,_0,_0.7)]'>
      <div onClick={setCurrentPage(homePage)} className='w-[25%]'>
         <div className='flex items-center justify-center'>{currentPage == homePage? <IoHomeSharp/>: <IoHomeOutline/>}</div>
         <div className='flex items-center justify-center'>Home</div>
         <div className={` ${currentPage == homePage? "opacity-100":"opacity-0"} transition-all ease-in-out`}></div>
      </div>


      <div onClick={setCurrentPage(searchPage)} className='w-[25%]'>
         <div className='flex items-center justify-center'>{currentPage == searchPage? <IoSearch />: <IoIosSearch />}</div>
         <div className='flex items-center justify-center'>Search</div>
         <div className={` ${currentPage == searchPage? "opacity-100":"opacity-0"} transition-all ease-in-out `}></div>
      </div>


      <div onClick={setCurrentPage(notificationPage)} className='w-[25%]'>
         <div className='flex items-center justify-center'>{currentPage == notificationPage? <IoMdNotifications />: <IoIosNotificationsOutline />}</div>
         <div className='flex items-center justify-center'>Notification</div>
         <di className={` ${currentPage == notificationPage? "opacity-100":"opacity-0"} transition-all ease-in-out `}v></di>
      </div>


      <div onClick={setCurrentPage(messagePage)} className='w-[25%]'>
         <div className='flex items-center justify-center'>{currentPage == messagePage? <IoChatbubbleEllipses />: <IoChatbubbleEllipsesOutline />}</div>
         <div className='flex items-center justify-center'>Message</div>
         <div className={` ${currentPage == messagePage? "opacity-100":"opacity-0"} transition-all ease-in-out `}></div>
      </div>
    </div>
   </div>
  )
}

export default Footbar
