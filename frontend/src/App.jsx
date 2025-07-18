import React, { useEffect } from 'react'
import Footbar from './components/Footbar'
import Navbar from './components/Navbar'
import {Outlet} from "react-router-dom"
import { useAuthStore } from './store/AuthStore'
import { useNavigate } from 'react-router-dom'
import { useSettingsStore } from './store/SettingsStore'
import { applyMode, applyTheme } from './lib/SetColours'
// import { usePageStore } from './store/PageStore'

const App = () => {
  const navigate = useNavigate();
  const {setnavigate} = useAuthStore();
  // const {getSettings,theme,mode} = useSettingsStore();
  // const {setNavigate} = usePageStore();

  useEffect(() => {
    setnavigate(navigate);
    // const response = getSettings();
    const savedMode = localStorage.getItem("accent-mode");
    if(savedMode) applyMode(savedMode);
    const savedAccent = localStorage.getItem("accent-theme");
    if (savedAccent) {
      applyTheme(savedAccent);
    }
    // applyTheme(response.data);
    // localStorage.setItem("accent-theme", response.data);
  }, [navigate]);

  
  return (
    <div className='transition-colors duration-500 '>
      <Navbar/>
      
      <Outlet/>

      <Footbar/>
    </div>
  )
}

export default App
