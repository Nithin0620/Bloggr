import React, { useEffect } from 'react'
import Footbar from './components/Footbar'
import Navbar from './components/Navbar'
import { Outlet } from "react-router-dom"
import { useAuthStore } from './store/AuthStore'
import { useNavigate } from 'react-router-dom'
import LogoutModal from "./components/LogoutModal"
import { applyMode, applyTheme, startSystemThemeListener } from './lib/SetColours'
import ShareModal from './components/ShareModal'
import { useIntractionStore } from './store/IntractionStore'
import { useBookmarkStore } from './store/BookmarkStore'

const App = () => {
  const navigate = useNavigate();
  const { setnavigate, checkAuth } = useAuthStore();
  const { getAllPostLikedByCurrentUser } = useIntractionStore();
  const { fetchBookmarkedIds } = useBookmarkStore();

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
