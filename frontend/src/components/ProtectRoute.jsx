import React from 'react'
import { useAuthStore } from '../store/AuthStore'
import toast from "react-hot-toast"

const ProtectRoute = ({ children }) => {
  const { token, authUser } = useAuthStore();

  if (!token && !authUser) {
    toast.error("Please login to access this page!");
    return (
      <div className="text-center mt-10 text-red-500 font-semibold">
        You are not allowed to visit this page until you login!
      </div>
    );
  }

  return children;
};

export default ProtectRoute;
