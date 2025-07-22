import React, { useState } from "react";
import { MdOutlineDeleteOutline } from "react-icons/md";
import {toast} from "react-hot-toast"
import { useNavigate } from "react-router-dom";

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

const Notification = () => {
  const [NotificationArray, setNotificationArray] = useState(dummyNotifications);
  const [selected, setSelected] = useState("All");

  const navigate = useNavigate()

  const handleSelected = (selector) => {
    setSelected(selector);
    if (selector === "All") setNotificationArray(dummyNotifications);
    else {
      const filteredNotification = dummyNotifications.filter(
        (notification) => notification.type === selector.toLowerCase()
      );
      setNotificationArray(filteredNotification);
    }
  };

  const handlenotificationmarkasread = (notificationId) => {};
  const handleMarkAllasRead = () => {};
  const handleClearAll = () => {};
  const handleDeleteNotification = (notificationId) => {};
  const handleViewPost = (postId) => {
    
  };
  const handleChatClick = () => {};
  const handleSenderProfileClick = (userId) => {
    navigate(`/profile/${userId}`)
  };

  return (
    <div className="p-6 min-h-screen flex justify-around transition-colors duration-300 accent-bg-mode accent-text-mode">
      <div className="w-[50%]">
        {/* Header */}
        <div className="text-xl  font-semibold mb-4 accent-text">🔔 Notifications</div>

        {/* Filter Buttons */}
        <div className="flex gap-4 mb-4">
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
          <button
            onClick={handleMarkAllasRead}
            className="px-3 py-1 rounded-3xl border accent-border hover:accent-bg-light accent-text transition"
          >
            🟢 Mark All as Read
          </button>
          <button
            onClick={handleClearAll}
            className="px-3 py-1 rounded-3xl border accent-border hover:accent-bg-light accent-text transition"
          >
            ❌ Clear All
          </button>
        </div>

        <hr className="mb-6" />

        {/* Notifications List */}
        <div className="space-y-4">
          {NotificationArray.map((notification) => (
            <div
              key={notification._id}
              onClick={() => handleViewPost(notification.post._id)}
              className="border accent-border rounded  p px-4 cursor-pointer py-2 40 flex flex-col gap-0 "
            >
              {/* Header */}
              <div className="flex items-center gap-3">
                <img
                  src={notification.sender.profilePic}
                  alt="avatar"
                  className="w-10 h-10 rounded-full"
                />
                <div className="text-sm">
                  <span
                    className="hover:underline font-medium cursor-pointer accent-text"
                    onClick={() => handleSenderProfileClick(notification.sender._id)}
                  >
                    {notification.sender.name}
                  </span>{" "}
                  {notification.type === "like" && "liked your post"}
                  {notification.type === "comment" && "commented on your post"}
                  {notification.type === "follow" && "started following you"}
                  {notification.post?.title && (
                    <>
                      {" "}
                      "<span className="italic accent-text">
                        {notification.post.title.length > 40
                          ? notification.post.title.substring(0, 40) + "..."
                          : notification.post.title}
                      </span>
                      "
                    </>
                  )}{" "}
                  <span className="font-bold ml-8">•</span>{" "}
                  <span className="accent-text">
                    {Math.floor((Date.now() - notification.updatedTime) / (1000 * 60))} mins ago
                  </span>
                </div>
              </div>

              {/* Post Image & Description */}
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

              {/* Follow Prompt */}
              {notification.type === "follow" && (
                <div
                  onClick={handleChatClick}
                  className="text-sm cursor-pointer accent-underline accent-text"
                >
                  Send a "Hello!" on chat?
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex gap-4 text-sm accent-text ">
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
