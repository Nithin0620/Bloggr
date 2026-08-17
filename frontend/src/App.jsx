import React, { useEffect } from 'react'
import Footbar from './components/Footbar'
import Navbar from './components/Navbar'
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { useAuthStore } from './store/AuthStore'
import LogoutModal from "./components/LogoutModal"
import { applyMode, applyTheme, startSystemThemeListener } from './lib/SetColours'
import ShareModal from './components/ShareModal'
import { useIntractionStore } from './store/IntractionStore'
import { useBookmarkStore } from './store/BookmarkStore'
import { initGA, trackPageView, setGAUser } from './lib/analytics'
import { initClarity, setClarityUser } from './lib/clarity'

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authUser, setnavigate, checkAuth } = useAuthStore();
  const { getAllPostLikedByCurrentUser } = useIntractionStore();
  const { fetchBookmarkedIds } = useBookmarkStore();

  useEffect(() => {
    initGA();
    initClarity();
  }, []);

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  useEffect(() => {
    if (authUser?._id) {
      setGAUser(authUser._id);
      const fullName = authUser.firstName ? `${authUser.firstName} ${authUser.lastName || ""}`.trim() : undefined;
      setClarityUser(authUser._id, undefined, undefined, fullName);
    }
  }, [authUser]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    getAllPostLikedByCurrentUser();
    fetchBookmarkedIds();
    checkAuth();
    setnavigate(navigate);

    // Apply saved theme immediately from localStorage (fast, no flash)
    const savedMode = localStorage.getItem("accent-mode") || "Light";
    const savedAccent = localStorage.getItem("accent-theme") || "Green";
    applyMode(savedMode);
    applyTheme(savedAccent);

    // Listen for system theme changes (for "System" mode)
    startSystemThemeListener();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  
  return (
    <div className='transition-colors duration-500 '>
      <Navbar/>
      
      <Outlet/>
      
      <LogoutModal/>
      <ShareModal/>

      <Footbar/>
    </div>
  )
}

export default App
