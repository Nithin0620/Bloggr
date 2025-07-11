import React, { useEffect } from 'react'
import Footbar from './components/Footbar'
import Navbar from './components/Navbar'
import {Outlet} from "react-router-dom"
import { useAuthStore } from './store/AuthStore'
import { useNavigate } from 'react-router-dom'
import { usePageStore } from './store/PageStore'

const App = () => {
  const navigate = useNavigate();
  const {setnavigate} = useAuthStore();
  const {setNavigate} = usePageStore();

  useEffect(() => {
    setnavigate(navigate);
    setNavigate(navigate);
  }, [navigate]);

  
  return (
    <div>
      <Navbar/>
      
      <Outlet/>

      <Footbar/>
    </div>
  )
}

export default App
