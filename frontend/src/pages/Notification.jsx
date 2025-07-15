import React, { useState } from "react";
import { MdOutlineDeleteOutline } from "react-icons/md";

// Dummy data
const dummyNotifications = [
   {
      _id: "1",
      type: "like",
      sender: {
         _id: "user1",
         name: "John Doe",
         profilePic: "https://via.placeholder.com/40",
      },
      post: {
         _id: "post1",
         title: "My Awesome Post",
         image: "https://via.placeholder.com/100",
         description: "This is a sample post description.",
      },
      updatedTime: Date.now() - 5 * 60000, // 5 minutes ago
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
      updatedTime: Date.now() - 10 * 60000, // 10 minutes ago
   },
];

const Notification = () => {
   const [NotificationArray,setNotificationArray]=useState(dummyNotifications);
   const [selected,setSelected] = useState("All");
   const handleSelected = (selector)=>{
      setSelected(selector);
      if(selector === "All") setNotificationArray(dummyNotifications);
      else {
         const filteredNotification = dummyNotifications.filter((notification)=>(notification.type ===selector.toLowerCase()));
         setNotificationArray(filteredNotification);
      }

   }

   const handlenotificationmarkasread = (notificationId) => {};
   const handleMarkAllasRead = () => {};
   const handleClearAll = () => {};
   const handleDeleteNotification = (notificationId) => {};
   const handleViewPost = (postId) => {};
   const handleChatClick = () => {};
   const handleSenderProfileClick = (senderId) => {};

   return (
      <div className="p-6 max-w-3xl min-h-screen mx-auto">
         {/* Header */}
         <div className="text-xl font-semibold mb-4">🔔 Notifications</div>

         {/* Filter Buttons */}
         <div className="flex gap-4 mb-4">
         <button className={`px-3 py-1 rounded-full border ${selected === "All" ? 'border-blue-700 bg-blue-50':''}`} onClick={()=>handleSelected("All")}>All</button>
         <button className={`px-3 py-1 rounded-full border ${selected === "Like" ? 'border-blue-700 bg-blue-50':''}`} onClick={()=>handleSelected("Like")}>Like</button>
         <button className={`px-3 py-1 rounded-full border ${selected === "Comment" ? 'border-blue-700 bg-blue-50':''} `} onClick={()=>handleSelected("Comment")}>Comment</button>
         <button className={`px-3 py-1 rounded-full border ${selected === "Follow" ? 'border-blue-700 bg-blue-50':''}`} onClick={()=>handleSelected("Follow")}>Follow</button>
         </div>

         {/* Controls */}
         <div className="flex gap-4 mb-4">
         <button
            onClick={handleMarkAllasRead}
            className="px-3 py-1 rounded-3xl border"
         >
            🟢 Mark All as Read
         </button>
         <button onClick={handleClearAll} className="px-3 py-1 rounded-3xl border">
            ❌ Clear All
         </button>
         </div>

         <hr className="mb-6" />

         {/* Notifications List */}
         <div className="space-y-6">
         {NotificationArray.map((notification) => (
            <div
            key={notification._id}
            className="border rounded p-4 flex flex-col gap-3"
            >
               {/* header */}
               <div className="flex items-center gap-3">
                  <img
                     src={notification.sender.profilePic}
                     alt="avatar"
                     className="w-10 h-10 rounded-full"
                  />
                  <div className="text-sm">
                     <span
                        className="font-medium cursor-pointer"
                        onClick={() =>
                        handleSenderProfileClick(notification.sender._id)
                        }
                     >
                        {notification.sender.name}
                     </span>{" "}
                     {notification.type === "like" && "liked your post"}
                     {notification.type === "comment" && "commented on your post"}
                     {notification.type === "follow" && "started following you"}
                     {notification.post?.title && (
                        <>
                        {" "}
                        "
                        <span className="italic">
                           {notification.post.title.length > 40
                              ? notification.post.title.substring(0, 40) + "..."
                              : notification.post.title}
                        </span>
                        "
                        </>
                     )}{" "}
                     <span className="font-bold ml-8">•</span>{" "}
                     {Math.floor(
                        (Date.now() - notification.updatedTime) / (1000 * 60)
                     )}{" "}
                     mins ago
                  </div>
            </div>

                  {/* middle part */}
               {notification.post?.image && (
               <div className="flex items-center gap-4">
                  <img
                     src={notification.post.image}
                     alt="post"
                     className="w-20 h-20 rounded object-cover"
                  />
                  <p className="text-sm">
                     {notification.post.description.length > 50
                     ? notification.post.description.substring(0, 50) + "..."
                     : notification.post.description}
                  </p>
               </div>
               )}

               {notification.type === "follow" && (
               <div
                  onClick={handleChatClick}
                  className="text-sm cursor-pointer underline"
               >
                  Send a "Hello!" on chat?
               </div>
               )}

               {/* footer */}
               <div className="flex gap-4 text-sm">
               {notification.post && (
                  <button
                     onClick={() => handleViewPost(notification.post._id)}
                     className="underline"
                  >
                     View Post
                  </button>
               )}
               <button
                  onClick={() => handlenotificationmarkasread(notification._id)}
                  className="underline"
               >
                  Mark as Read
               </button>
               <button
                  onClick={() => handleDeleteNotification(notification._id)}
                  className="flex items-center gap-1 underline right-0"
               >
                  <MdOutlineDeleteOutline /> Delete
               </button>
               </div>
            </div>
         ))}
         </div>
      </div>
   );
};

export default Notification;
