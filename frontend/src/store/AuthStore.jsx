import {create } from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast";
import {io} from "socket.io-client"
import axios from 'axios';
import { usePageStore } from "./PageStore";
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
      // console.log("navigate",navigate)
      set({navigate:navigatefn});
   },
   
   login : async(data)=>{
      set({isLoggingin:true});
      try{
         const response = await axios.post(`${BASE_URL}/auth/login`,data);
         
         if(response.data.success){
            toast.success("User logged in successfully");
            // console.log("response.data:",response.data.data);
            // console.log("response.data.token:",response.data.data.token);
            set({authUser:response.data.data})
            set({token:response.data.data.token});
            // localStorage.setItem("token",response.data.data.token);
            get().connectSocket();
            const navigatefn = get().navigate;
            
            if(navigatefn) navigatefn("/");
         }
         else{
            throw new Error("Error occured in server");  
         }
      }
      catch(e){
         console.log("error occured in signup function in zustand:",e);
         set({authUser:null});
      }
      finally{
         set({isLoggingin:false});
      }
   },

   sendotp: async(email)=>{
      set({isSendingotp:true});
      try{
         // console.log("response:",email)
         // console.log("url:",BASE_URL)
         const response = await axiosInstance.post(`${BASE_URL}/auth/sendotp`,{email});
         
         // console.log("response in sendOtp:",response.data.success)
         if(response.data.success) {
            
            toast.success(response.data.message);
            const navigatefn = get().navigate;
            if(navigatefn) navigatefn("/verifyemail")
         }
                  
      }
      catch(e){
         toast.error(e.message)
         console.log("error in the auth store in sendotp:",e);
      }
      finally{
         set({isSendingotp:false});
      }
   },

   signup: async(data)=>{
      set({isSigningup:true});
      try{
         const response = await axios.post(`${BASE_URL}/auth/signup`,data);
         // console.log(response)
         if(response.data.success){
            toast.success("Account created Successfully");
            const navigatefn  = get().navigate;
            toast.success("please login yourself after creating account!")
            if(navigatefn) navigatefn("/login")
         }
         else{
            throw new Error ("Error occured in the signp i think from server the error is comming from ")
         }
      }
      catch(e){
         console.log("Error occured in signup function in zustand store:",e);
         toast.error(e.message)
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
            toast.success("Loggeed out Successfully");
            get().disconnectSocket();
            const navigate = get().navigate;
            if(navigate) navigate("/");
            
         }
         else{
            throw new Error("Error in loggin out");
         }
      }
      catch (error) {
         console.log("error in logour", error)
         toast.error(error.message);
      }
      finally{
         set({isLoggingout:false});
      }
   },

   checkAuth:async()=>{
      try{
         get().disconnectSocket();
         const response = await axios.get(`${BASE_URL}/auth/checkauth`);
         // console.log("check",response)
         // console.log("checkauth:",response.data.success)
         if(response.data.success){
            set({authUser:response.data.data.user});
            set({token:response.data.data.token});
            get().connectSocket();
            // localStorage.setItem("token",response.data.data.token);
         }

         if (!response.data.success && response.data.code === "JWT_EXPIRED") {
            console.log("Session expired. Showing nothing...");
            return; 
         }
         // console.log("hello",get().authUser)
      }
      catch(e){
         if(e.message === "JWT_EXPIRED") {
            toast.error("JWT EXpired")
         } 
         console.log(e);
         // toast.error("Error occured in checking auth");
      }
   },

   connectSocket: ()=>{
      const {authUser} = get();
      if(!authUser || get().socket?.connected) return;
      console.log("Connecting with userId:", authUser._id); 

      const socket = io(`${process.env.REACT_APP_MODE === "development" ? "http://localhost:4000" : "https://bloggr-y7gx.onrender.com"}`,{
         query:{
            userId:authUser._id,
         },
         withCredentials:true
      })
      // socket.connect();

      set({socket:socket});

      socket.on("getOnlineUsers",(userIds)=>{
         // console.log("online users",userIds)
         set({onlineUsers:userIds});
      })
      socket.on("newNotification",()=>{
         toast.success("You have a new notification")
      })
      // console.log("socket connected")
   },

   disconnectSocket: ()=>{
      if(get().socket?.connected) get().socket.disconnect();
   }   
}))

