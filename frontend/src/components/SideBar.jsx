import { useEffect, useState } from "react";
import { useChatStore } from "../store/ChatStore";
import { useAuthStore } from "../store/AuthStore";
import { Users } from "lucide-react";
import SideBarSkeleton from "./skeletons/SideBarSkeleton";

const SideBar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

    console.log("filtered user",filteredUsers)
  if (isUsersLoading) return <SideBarSkeleton />;

  return (
    <aside className="min-h-screen w-20 lg:w-72 border-r border-base-300 flex flex-col shadow-accent-box transition-colors accent-box-shadow duration-300 accent-bg-mode accent-text-mode">
      <div className="border-b accent-box-shadow accent-border border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6 accent-shadow accent-text" />
          <span className="font-medium hidden accent-text lg:block">Contacts</span>
        </div>

        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm shadow-accent-box accent-bg-mode"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length > 0 ? onlineUsers.length - 1 : 0} online)
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full ">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "accent-bg-light bg-opacity-0" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-12 w-8 h-8 object-cover rounded-full shadow-accent-box"
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
              )}
            </div>

            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.firstName + " " + user.lastName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
};

export default SideBar;
