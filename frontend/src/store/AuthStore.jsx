import {create } from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast";
import {io} from "socket.io-client"


const BASE_URL = process.env.REACT_APP_MODE === "development" ? process.env.BACKEND_API_BASE_URL : "/"

export const useAuthStore = create((set,get)=>({
   navigate:null,
   token: localStorage.getItem("token") || null,
   authUser : null,
   onlineUsers: [],
   socket: null,

   isSigningup:false,
   isLoggingin:false,
   isSendingotp :false,
   isUpdatingprofile :false,
   isLoggingout:false,

   setnavigate: async(navigate)=>{
      set({navigate:navigate});
   },

   login : async(data)=>{
      set({isLoggingin:true});
      try{
         const response = await axiosInstance.post("/auth/login",data);

         if(response.data.success){
            toast.success("User logged in successfully");
            set({authUser:response.data})
            get().connectSocket();
            const navigate = get().navigate;
            if(navigate) navigate("/");
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
         const response = await axiosInstance.post("/auth/sendotp",email);

         if(response.data.success) {

            const navigate = get().navigate;
            if(navigate) navigate("/verify-email");
         }
         
         
      }
      catch(e){

      }
      finally{
         set({isSendingotp:false});
      }
   },

   signup: async(data)=>{
      set({isSigningup:true});
      try{
         const response = await axiosInstance.post("/auth/signup",data);
         if(response.data.success){
            toast.success("Account created Successfully");
            const navigate = get().navigate;
            if(navigate) navigate("/login");
         }
         else{
            throw new Error ("Error occured in the signp i think from server the error is comming from ")
         }
      }
      catch(e){
         console.log("Error occured in signup function in zustand store:",e);
      }
      finally{
         set({isSigningup:false});
      }
   },
   logout:async()=>{
      set({isLoggingout:true});
      try{
         const response = await axiosInstance.post("/logout");
         if(response){
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
         toast.error(error.response.data.message);
      }
      finally{
         set({isLoggingout:false});
      }
   },

   connectSocket: ()=>{
      const {authUser} = get();
      if(!authUser || get().socket?.connected) return;

      const socket = io(BASE_URL,{
         query:{
            userId:authUser._id,
         },
      })
      socket.connect();

      set({socket:socket});

      socket.on("getOnlineUsers",(userIds)=>{
         set({onlineUsers:userIds});
      })
   },

   disconnectSocket: ()=>{
      if(get().socket?.connected) get().socket.disconnect();
   }   
}))

