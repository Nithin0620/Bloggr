import React from "react";
import { IoMdClose } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";



const FollowListModal = ({ setLiked, isOpen, onClose, title, users }) => {

  const navigate = useNavigate();

  const formatDate = (date)=>{
    const newDate = new Date(date);
    return newDate.toLocaleDateString("en-US",{
      year:"numeric",
      month:"long",
      day:"numeric",
    })
  }

  const handleViewProfile = (userId) =>{
    navigate(`/profile/${userId}`)
    setTimeout(()=>{
      setLiked(true);
      onClose()
    },500)
    
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm z-50 flex justify-center items-center px-2">
      <div className="accent-bg-mode accent-text-mode rounded-2xl shadow-accent-box max-w-md w-full p-4 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold accent-text">{title}</h2>
          <button
            className="absolute hover:rotate-90 hover:scale-75 transition-all duration-500 top-4 right-4 text-2xl text-red-500"
            onClick={onClose}
         >
            <IoMdClose />
         </button>
        </div>

        <div className="max-h-80 overflow-y-auto space-y-3">
          {users?.length > 0 ? (
            users.map((user) => (
              <div
                key={user._id}
                className="flex  items-center gap-3 hover:bg-muted/20 p-2 rounded-xl transition"
              >
                <img
                  src={user.profilePic || "/default-avatar.png"}
                  alt={user.firstName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p onClick={()=>handleViewProfile(user._id)} className="hover:underline font-medium">{user.firstName} {user.lastName}</p>
                  <p className="text-sm text-muted-foreground">user since {formatDate(user.createdAt)}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-10">
              No {title.toLowerCase()} to show.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowListModal;
