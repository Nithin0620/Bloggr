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
import ReadMorePost from "./pages/ReadMorePost"
import Explore from "./pages/Explore"
import ProtectRoute from "./components/ProtectRoute"


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
            path:"profile/:userId",
            element:<ProtectRoute><Profile/></ProtectRoute>
         },
         {
            path:"notification",
            element:<ProtectRoute><Notification/></ProtectRoute>
         },
         {
            path:"settings",
            element:<ProtectRoute><Settings/></ProtectRoute>
         },{
            path:"verifyemail",
            element:<VerifyOtp/>
         },
         {
            path:"message",
            element:<ProtectRoute><Message/></ProtectRoute>
         },
         {
            path:"/readmore/:postId",
            element:<ProtectRoute><ReadMorePost/></ProtectRoute>
         },
         {
            path:"explore",
            element:<ProtectRoute><Explore/></ProtectRoute>
         },
      ]
   },
])