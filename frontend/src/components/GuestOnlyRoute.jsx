import React from 'react'
import { useAuthStore } from '../store/AuthStore'
import { Navigate } from 'react-router-dom'

const GuestOnlyRoute = ({ children }) => {
  const { token, authUser } = useAuthStore();

  if (token || authUser) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default GuestOnlyRoute;
