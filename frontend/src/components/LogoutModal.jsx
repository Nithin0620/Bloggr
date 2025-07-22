import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";

const LogoutPage = () => {
  const { logout, isLogoutModalOpen, setIsLogoutModalOpen } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
    navigate("/login");
  };

  const handleCancel = () => {
    setIsLogoutModalOpen(false);
    // navigate("/");
  };

  if (!isLogoutModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black backdrop-blur-sm bg-opacity-50">
      <div className="w-[90%] sm:w-[400px] p-6 rounded-2xl accent-bg-mode shadow-accent-box relative">
        <h2 className="text-xl sm:text-2xl  font-semibold accent-text mb-4">
          Logout
        </h2>
        <p className="mb-6 accent-text-mode">
          Are you sure you want to logout?
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={handleCancel}
            className="px-4 py-2 rounded-lg border accent-text-mode accent-border  accent-text-bg  hover:scale-95 transition-all  duration-500"
          >
            Cancel
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg accent-bg accent-text-mode shadow-accent-box hover:opacity-80 transition-all duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutPage;
