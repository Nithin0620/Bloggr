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
import { useIntractionStore } from './store/IntractionStore'
// import { usePageStore } from './store/PageStore'

const App = () => {
  const navigate = useNavigate();
  const {setnavigate,authUser,token,checkAuth} = useAuthStore();
  const{fetchCategories,fetchPosts} = usePostStore();
  const {getAllPostLikedByCurrentUser} = useIntractionStore();
  const {getSettings} = useSettingsStore();
  // const {getSettings,theme,mode} = useSettingsStore();
  // const {setNavigate} = usePageStore();


  useEffect(() => {

    // const getSettingsOnRender = async()=>{
    //   // if(!token) return;
    //   console.log("here in app")
    //   const response = await getSettings();
    //   console.log("response in app",response)
    // }
    // getSettingsOnRender();

    getAllPostLikedByCurrentUser();
    fetchPosts();
    fetchCategories();
    checkAuth();
    setnavigate(navigate);
    const savedMode = localStorage.getItem("accent-mode");
    if(!savedMode) localStorage.setItem("accent-mode","Dark");
    const savedMode2 = localStorage.getItem("accent-mode");
    if(savedMode || savedMode2) applyMode(savedMode || savedMode2);
    const savedAccent = localStorage.getItem("accent-theme");
    if(!savedAccent) localStorage.setItem("accent-theme","Yellow");
    const savedAccent2 = localStorage.getItem("accent-theme");
    if (savedAccent ||savedAccent2) {
      applyTheme(savedAccent || savedAccent2);
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
