import React, { useEffect } from 'react'
import Footbar from './components/Footbar'
import Navbar from './components/Navbar'
import {Outlet} from "react-router-dom"
import { useAuthStore } from './store/AuthStore'
import { useNavigate } from 'react-router-dom'
import { useSettingsStore } from './store/SettingsStore'
import LogoutModal from "./components/LogoutModal"
import { applyMode, applyTheme } from './lib/SetColours'
import ShareModal from './components/ShareModal'
import { usePostStore } from './store/PostStore'
import { usePageStore } from './store/PageStore'
// import { usePageStore } from './store/PageStore'

const App = () => {
  const navigate = useNavigate();
  const {setnavigate,checkAuth} = useAuthStore();
  const{fetchCategories,fetchPosts} = usePostStore();
  // const {getSettings,theme,mode} = useSettingsStore();
  // const {setNavigate} = usePageStore();


  useEffect(() => {
    fetchPosts();
    fetchCategories();
    checkAuth();
    setnavigate(navigate);
    const savedMode = localStorage.getItem("accent-mode");
    if(savedMode) applyMode(savedMode);
    const savedAccent = localStorage.getItem("accent-theme");
    if (savedAccent) {
      applyTheme(savedAccent);
    }
  
  }, [navigate]);

  
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
