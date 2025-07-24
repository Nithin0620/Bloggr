import { create } from "zustand";
import axios from "axios"
const BASE_URL = "http://localhost:4000/api"

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

   getMessages : async()=>{

   },

   subscribeToMessages : async()=>{
      
   },

   unsubscribeFromMessages : async()=>{
      
   },

   sendMessage: async()=>{

   },
   
   setSelectedUser: (selectedUser) => {
      console.log(selectedUser)
      set({ selectedUser:selectedUser })
      set({chatSelected:selectedUser});
   }
}))