import {create } from "zustand"
import toast from "react-hot-toast";
import {io} from "socket.io-client"
import axios from 'axios';
axios.defaults.withCredentials = true;


const BASE_URL = process.env.REACT_APP_MODE === "development" ? "http://localhost:4000/api" : "/api";

export const useAuthStore = create((set,get)=>({

   navigate:null,
   token: localStorage.getItem("token") || null,
   authUser : null,
   onlineUsers: [],
   socket: null,

   isLogoutModalOpen:false,
   setIsLogoutModalOpen: (val)=>{
      set({isLogoutModalOpen:val})
   },

   isSigningup:false,
   isLoggingin:false,
   isSendingotp :false,
   isUpdatingprofile :false,
   isLoggingout:false,
   beforeSignUpData:null,

   setBeforeSignUpData : (data)=>{
      set({beforeSignUpData:data})
   },

   setnavigate: async(navigatefn)=>{
      set({navigate:navigatefn});
   },

   login : async(data)=>{
      set({isLoggingin:true});
      try{
         const response = await axios.post(`${BASE_URL}/auth/login`,data);

         if(response.data.success){
            toast.success("User logged in successfully");
            set({authUser:response.data.data})
            set({token:response.data.data.token});
            get().connectSocket();
            const navigatefn = get().navigate;

            if(navigatefn) navigatefn("/");
         }
         else{
            throw new Error("Error occured in server");
         }
      }
      catch(e){
         console.error("login error:", e.response?.data || e.message);
         toast.error(e.response?.data?.message || "Login failed")
         set({authUser:null});
      }
      finally{
         set({isLoggingin:false});
      }
   },

   sendotp: async(email)=>{
      set({isSendingotp:true});
      try{
         const response = await axios.post(`${BASE_URL}/auth/sendotp`,{email});

         if(response.data.success) {

            toast.success(response.data.message);
            const navigatefn = get().navigate;
            if(navigatefn) navigatefn("/verifyemail")
         }

      }
      catch(e){
         console.error("sendotp error:", e.response?.data || e.message);
         toast.error(e.response?.data?.message || "Failed to send OTP")
      }
      finally{
         set({isSendingotp:false});
      }
   },

   signup: async(data)=>{
      set({isSigningup:true});
      try{
         const response = await axios.post(`${BASE_URL}/auth/signup`,data);
         if(response.data.success){
            toast.success("Account created Successfully");
            const navigatefn  = get().navigate;
            toast.success("please login yourself after creating account!")
            if(navigatefn) navigatefn("/login")
         }
         else{
            throw new Error ("Error occured in the signup")
         }
      }
      catch(e){
         console.error("signup error:", e.response?.data || e.message);
         toast.error(e.response?.data?.message || "Signup failed")
      }
      finally{
         set({isSigningup:false});
      }
   },

   logout:async()=>{
      set({isLoggingout:true});
      try{
         const response = await axios.post(`${BASE_URL}/auth/logout`);
         if(response.data.success){
            set({token:null});
            set({authUser:null});
            toast.success("Logged out Successfully");
            get().disconnectSocket();
            const navigate = get().navigate;
            if(navigate) navigate("/");

         }
         else{
            throw new Error("Error in loggin out");
         }
      }
      catch (error) {
         console.error("logout error:", error.response?.data || error.message);
         toast.error(error.response?.data?.message || "Logout failed");
      }
      finally{
         set({isLoggingout:false});
      }
   },

   checkAuth:async()=>{
      try{
         get().disconnectSocket();
         const response = await axios.get(`${BASE_URL}/auth/checkauth`);
         if(response.data.success){
            set({authUser:response.data.data.user});
            set({token:response.data.data.token});
            get().connectSocket();
         }

         if (!response.data.success && response.data.code === "JWT_EXPIRED") {
            return;
         }
      }
      catch(e){
         console.error("checkAuth error:", e.response?.data || e.message);
      }
   },

   connectSocket: ()=>{
      const {authUser} = get();
      if(!authUser || get().socket?.connected) return;

      const socket = io(`${process.env.REACT_APP_MODE === "development" ? "http://localhost:4000" : "https://bloggr-y7gx.onrender.com"}`,{
         query:{
            userId:authUser._id,
         },
         withCredentials:true
      })

      set({socket:socket});

      socket.on("getOnlineUsers",(userIds)=>{
         set({onlineUsers:userIds});
      })
      socket.on("newNotification",()=>{
         toast.success("You have a new notification")
      })
   },

   disconnectSocket: ()=>{
      if(get().socket?.connected) get().socket.disconnect();
   }
}))
