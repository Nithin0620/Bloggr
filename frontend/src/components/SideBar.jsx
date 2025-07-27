import { useEffect, useState } from "react";
import { useChatStore } from "../store/ChatStore";
import { useAuthStore } from "../store/AuthStore";
import { Users, Menu } from "lucide-react";
import SideBarSkeleton from "./skeletons/SideBarSkeleton";

const SideBar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [isOpen, setIsOpen] = useState(true); // Toggle for mobile

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SideBarSkeleton />;

  return (
    <>
      {/* Burger Icon for mobile */}
      <div className={`md:hidden fixed top-16 accent-text ${isOpen? "left-0 ":"left-3"} transition-all duration-500 z-50`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md bg-accent bg-slate-200 shadow-md"
        >
          <Menu className="size-6" />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static  z-40
          h-full min-h-screen w-72 md:w-20 lg:w-72
          border-r border-base-300 shadow-accent-box
          transition-transform duration-300 ease-in-out
          accent-bg-mode accent-text-mode
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="border-b accent-box-shadow accent-border border-base-300 p-3 md:p-5 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Users className="size-6 accent-shadow accent-text" />
            <span className="font-medium accent-text block">Contacts</span>
          </div>

          <div className="mt-2 lg:mt-3 flex items-center gap-2">
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

        {/* User List */}
        <div className="flex-1 flex flex-col gap-2 overflow-y-auto p-2">
          {filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => {
                setSelectedUser(user);
                setIsOpen(false); // close sidebar on mobile after selection
              }}
              className={`p-2 md:p-3 accent-border border-b shadow-slate-400 shadow-sm flex items-center gap-3 hover:bg-base-300 transition-colors rounded-lg ${
                selectedUser?._id === user._id ? "accent-highlight bg-opacity-0" : ""
              }`}
            >
              <div className="relative">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.name}
                  className="h-9 w-9 object-cover rounded-full shadow-accent-box"
                />
                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 h-2 w-2 bg-green-500 rounded-full" />
                )}
              </div>
              <div className="lg:block text-left min-w-0">
                <div className="font-medium accent-text-mode truncate">
                  {user.firstName + " " + user.lastName}
                </div>
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
    </>
  );
};

export default SideBar;
