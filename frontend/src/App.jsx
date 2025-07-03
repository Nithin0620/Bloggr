import React from 'react'
import Footbar from './components/Footbar'
import Navbar from './components/Navbar'
import {Outlet} from "react-router-dom"

const App = () => {
  return (
    <div>
      <Navbar/>
      
      <Outlet/>

      <Footbar/>
    </div>
  )
}

export default App
