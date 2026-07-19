import React, { useEffect } from 'react'
import Footbar from './components/Footbar'
import Navbar from './components/Navbar'
import { Outlet } from "react-router-dom"
import { useAuthStore } from './store/AuthStore'
import { useNavigate } from 'react-router-dom'
import LogoutModal from "./components/LogoutModal"
import { applyMode, applyTheme } from './lib/SetColours'
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
    const savedMode = localStorage.getItem("accent-mode");
    if (!savedMode) localStorage.setItem("accent-mode", "Light");
    const savedMode2 = localStorage.getItem("accent-mode");
    if (savedMode || savedMode2) applyMode(savedMode || savedMode2);
    const savedAccent = localStorage.getItem("accent-theme");
    if (!savedAccent) localStorage.setItem("accent-theme", "Green");
    const savedAccent2 = localStorage.getItem("accent-theme");
    if (savedAccent || savedAccent2) {
      applyTheme(savedAccent || savedAccent2);
    }
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
