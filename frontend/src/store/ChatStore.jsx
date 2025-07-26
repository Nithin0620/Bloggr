import { create } from "zustand";
import axios from "axios"
import toast from "react-hot-toast";
import { useAuthStore } from "./AuthStore";


const BASE_URL = process.env.REACT_APP_MODE === "development" ? "http://localhost:4000/api" : "/api";

export const useChatStore = create((set,get)=>({
   messages: [],
   users: [],
   selectedUser: null,
   isUsersLoading: false,
   isMessagesLoading: false,
   chatSelected:false,


   getUsers: async()=>{
      set({isUsersLoading:true});
      try{
         const response = await axios.get(`${BASE_URL}/messages/getusersforsidebar`)
         console.log(response)
         console.log(response.data.data)
         if(response.data.success){
            set({users:response.data.data})
         }
      }
      catch(e){
         console.log(e);
      }
      finally{
         set({isUsersLoading:false})
      }
   },

   getMessages : async(id)=>{
      set({isMessagesLoading:true});
      try{
         const response = await axios.get(`${BASE_URL}/messages/getmessages/${id}`);
         console.log(response);
         if(response?.data?.success){
            set({messages:response.data.data});
         }
      }
      catch(e){
         console.log(e);
         toast.error("Error occured in retriving previous chats! sorry for your losses.")
      }
      set({isMessagesLoading:false});
   },

   subscribeToMessages : async()=>{
      const {selectedUser} = get();

      if(!selectedUser) return ;

      const socket = useAuthStore.getState().socket;

      socket.on("newMessage",(newMessage)=>{
         const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
         if(isMessageSentFromSelectedUser){
            set({messages:[...get().messages,newMessage]});
         }
      })

   },

   unsubscribeFromMessages : async()=>{
      const socket  = useAuthStore.getState().socket;

      socket.off("newMessage");
   },

   sendMessage: async(data)=>{
      const message = get().messages;
      const selectedUser = get().selectedUser;
      try{
         const response = await axios.post(`${BASE_URL}/messages/sendmessage/${selectedUser._id}`,data);
         set({messages:[...message,response.data.data]})
         // toast.error(" message sent")
      }
      catch(e){
         console.log(e);
         toast.error("An error occured in sending the message.")
         toast.error("we are working tirelessly to fix it pls try after some time.")
      }
   },
   
   setSelectedUser: (selectedUser) => {
      console.log(selectedUser)
      set({ selectedUser:selectedUser })
      set({chatSelected:selectedUser});
   }
}))