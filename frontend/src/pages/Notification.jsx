import React, { useEffect, useState } from "react";
import { MdOutlineDeleteOutline } from "react-icons/md";
import {toast} from "react-hot-toast"
import { useNavigate } from "react-router-dom";
import { useIntractionStore } from "../store/IntractionStore";
import {Loader} from "lucide-react"
import { usePageStore } from "../store/PageStore";
import Ripples from 'react-ripples';


const dummyNotifications = [
  {
    _id: "1",
    type: "like",
    sender: {
      _id: "user1",
      firstName: "John",
      LastName: "John Doe",
      profilePic: "https://via.placeholder.com/40",
    },
    post: {
      _id: "post1",
      title: "My Awesome Post",
      image: "https://via.placeholder.com/100",
      content: "This is a sample post description.",
    },
    updatedTime: Date.now() - 5 * 60000,
  },
  {
    _id: "2",
    type: "comment",
    sender: {
      _id: "user2",
      name: "Jane Smith",
      profilePic: "https://via.placeholder.com/40",
    },
    post: {
      _id: "post2",
      title: "Another Post",
      image: "https://via.placeholder.com/100",
      description: "Commented post here.",
    },
    updatedTime: Date.now() - 10 * 60000,
  },
];


const getTimeAgo = (timestamp) => {
  const now = Date.now();
  const updated = new Date(timestamp).getTime();
  const diffInMinutes = Math.floor((now - updated) / (1000 * 60));

  if (diffInMinutes < 60) {
    return `${diffInMinutes} min${diffInMinutes === 1 ? "" : "s"} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hr${diffInHours === 1 ? "" : "s"} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
};
    

const Notification = () => {

  const [isUpdated,setIsUpdated] = useState(false);

  const {setCurrentPage} = usePageStore();
  const [NotificationArray, setNotificationArray] = useState([]);
  const [allNotification, setAllNotification] = useState([]);
  const [selected, setSelected] = useState("All");

  const {getAllNotifications,MarkAllAsRead,MarkNotificationAsRead,DeleteNotification,ClearAllNotification} = useIntractionStore();

  const navigate = useNavigate()

  const [loading , setLoading] = useState(false);


  useEffect(()=>{
    
    setIsUpdated(false);
    const array = getAllNotificationFunction();
  },[isUpdated])

  const handleSelected = (selector) => {
    setSelected(selector);
    if (selector === "All") setNotificationArray(allNotification);
    else {

      const filteredNotification = allNotification.filter(
        (notification) => notification.type === selector.toLowerCase()
      );
      setNotificationArray(filteredNotification);
    }
  };

  const getAllNotificationFunction = async()=>{
    setLoading(true);
    const response = await getAllNotifications();
    // console.log("notification",response);
    setAllNotification(response);
    setNotificationArray(response);
    setLoading(false);
  
  }

  const handlenotificationmarkasread = async(notificationId) => {
    await MarkNotificationAsRead(notificationId)
    setIsUpdated(true);
  };



  const handleMarkAllasRead = async() => {
    await MarkAllAsRead();
    setIsUpdated(true);
  };
  const handleClearAll = async() => {

    await ClearAllNotification();
    setIsUpdated(true);
  };
  const handleDeleteNotification = async(notificationId) => {

    await DeleteNotification(notificationId);
    setIsUpdated(true);
  };


  const handleViewPost = (notificationId,postId) => {

    setCurrentPage("Read-more")
    // handlenotificationmarkasread(notificationId);
    navigate(`/readmore/${postId}`)
  };

  const handleChatClick = () => {
    navigate("/message")
  };
  const handleSenderProfileClick = (userId) => {
    setCurrentPage("profile")
    navigate(`/profile/${userId}`)
  };


  return (
    <div className="p-6 min-h-screen flex justify-around transition-colors duration-300 accent-bg-mode accent-text-mode">
      <div className="md:w-[50%] w-full">
        {/* Header */}
        <div className="text-xl  font-semibold mb-4 accent-text">🔔 Notifications</div>

        {/* Filter Buttons */}
        <div className="flex md:gap-4 gap-3 md:mb-4 mb-4">
          {["All", "Like", "Comment", "Follow"].map((type) => (
            <button
              key={type}
              onClick={() => handleSelected(type)}
              className={`px-3 py-1 rounded-full border transition-all duration-150 ${
                selected === type
                  ? "accent-bg-light accent-border accent-text"
                  : "border-gray-300"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex gap-4 mb-6">
           <Ripples className="rounded-3xl" color="rgba(182, 240, 199)">
            <button
              onClick={handleMarkAllasRead}
              className="px-3 py-1 rounded-3xl border accent-border hover:accent-bg-light accent-text transition"
            >
              🟢 Mark All as Read
            </button>
          </Ripples>
          <Ripples className="rounded-3xl" color="rgba(247, 143, 143)">
          <button
            onClick={()=>handleClearAll()}
            className="px-3 py-1 rounded-3xl border accent-border hover:accent-bg-light accent-text transition"
          >
            ❌ Clear All
          </button>
          </Ripples>
        </div>

        <hr className="mb-6" />

        {/* Notifications List */}
        <div className="space-y-4 relative flex flex-col ">
            <div className="absolute z-50 mx-auto ml-60 mt-2 flex items-center justify-center">
              {loading && (
                <div>
                  <Loader className="animate-spin"/>
                </div>
              )}
            </div>

              <div>
                {
                  NotificationArray.length === 0 && (
                    <div className="flex items-center justify-center mt-16 ml-60 accent-text-mode"> No Don't have any Notifiction</div>
                  )
                }
              </div>

          {NotificationArray.map((notification) => (
            <div
              key={notification._id}
              
              className={`border accent-border transition-all duration-300 hover:bg-black hover:bg-opacity-5 hover:scale-[1.02] hover:shadow-accent-box  rounded-3xl   px-4 cursor-pointer py-2  flex flex-col gap-0 ${notification.isRead ? "":" accent-highlight"}`}
            >
              {/* Header */}
              <div className="flex items-center gap-3">
                <img
                  src={notification.sender.profilePic}
                  alt="avatar"
                  className="w-6 h-6 rounded-full"
                />
                <div className="text-sm">
                  <span
                    className="hover:underline font-medium cursor-pointer accent-text"
                    onClick={() => handleSenderProfileClick(notification.sender._id)}
                  >
                    {notification.sender.firstName + " " + notification.sender.lastName}
                  </span>{" "}
                  {notification.type === "like" && "liked your post"}
                  {notification.type === "comment" && "commented on your post"}
                  {notification.type === "follow" && "started following you"}
                  {notification.post?.title && (
                    <>
                      {" "}
                      "<span onClick={()=>handleViewPost(notification._id,notification.post._id)} className="italic hover:underline accent-text">
                        {notification.post.title.length > 40
                          ? notification.post.title.substring(0, 40) + "..."
                          : notification.post.title}
                      </span>
                      "
                    </>
                  )}{" "}
                  
                </div>
              </div>

              <span className="text-xs accent-text-mode flex justify-end">
                <span className=" ml-8">•</span>{" "}
                {getTimeAgo(notification.createdAt)}
              </span>
                  

              {/* Post Image & Description */}
              {notification.post?.image && (
                <div onClick={() => handleViewPost(notification._id,notification.post._id)} className="flex items-center md:-mt-3 mt-0 gap-4">
                  <img
                    src={notification.post.image}
                    alt="post"
                    className="w-24 h-24 rounded object-cover"
                  />
                  <div>
                  <p className="text-sm">
                    {notification.post.content.length > 150
                      ? notification.post.content.substring(0, 150) + "..."
                      : notification.post.content}
                  </p>
                  </div>
                </div>
              )}

              {/* Follow Prompt */}
              {notification.type === "follow" && (
                <div
                  onClick={handleChatClick}
                  className=" cursor-pointer font-bold text-base hover:underline accent-text"
                >
                  Send a "Hello!" on chat?
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex gap-4 mt-1 text-sm accent-text ">
                <button
                  onClick={() => handlenotificationmarkasread(notification._id)}
                  className="accent-underline"
                >
                  Mark as Read
                </button>
                <button
                  onClick={() => handleDeleteNotification(notification._id)}
                  className="flex items-center gap-1 text-red-600 hover:underline "
                >
                  <MdOutlineDeleteOutline /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-[0.12rem] rounded-full  bg-gray-400 min-h-screen"></div>
      <div className="max-w-xl">

      </div>
    </div>
  );
};

export default Notification;
