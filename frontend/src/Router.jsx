import {createBrowserRouter} from "react-router-dom"
import App from "./App"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Home from "./pages/Home"
import Profile from "./pages/Profile"
import Notification from "./pages/Notification"
import Settings from "./pages/Settings"
import VerifyOtp from "./pages/VerifyOtp"
import Message from "./pages/Message"


export const router = createBrowserRouter([
   {
      path: "/",
      element:<App/>,
      children:[
         {
            path:"",
            element:<Home/>
         },
         {
            path:"login",
            element:<Login/>
         },
         {
            path:"signup",
            element:<Signup/>
         },
         {
            path:"profile",
            element:<Profile/>
         },
         {
            path:"notification",
            element:<Notification/>
         },
         {
            path:"settings",
            element:<Settings/>
         },{
            path:"verifyemail",
            element:<VerifyOtp/>
         },
         {
            path:"message",
            element:<Message/>
         }
      ]
   },
])