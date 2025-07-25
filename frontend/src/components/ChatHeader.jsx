import { X } from "lucide-react";
import { useAuthStore } from "../store/AuthStore";
import { useChatStore } from "../store/ChatStore";
import { IoMdClose } from "react-icons/io";
import {useNavigate} from "react-router-dom"

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const navigate = useNavigate();
  return (
    <div className="p-2.5 border-base-300 accent-bg-mode accent-text-mode shadow-accent-box rounded-t-md transition-colors duration-300 accent-bg-mode accent-text-mode">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className=" h-9 w-9 rounded-full relative shadow-accent-box">
              <img
                src={selectedUser.profilePic || "./avatar.png"}
                alt={selectedUser.firstName + " " + selectedUser.lastName}
                className="rounded-full"
              />
            </div>
          </div>

          <div>
            <h3 onClick={()=>navigate(`/profile/${selectedUser._id}`)} className="hover:underline cursor-pointer font-medium">{selectedUser.firstName + " " + selectedUser.lastName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <button
          className="absolute hover:rotate-90 hover:scale-75 transition-all duration-500 right-10 text-2xl text-red-500"
          onClick={() => setSelectedUser(null)}
        >
          <IoMdClose />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
