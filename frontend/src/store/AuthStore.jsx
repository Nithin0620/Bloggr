import {create } from "zustand"


const BASE_URL = import.meta.env.MODE === "development" ? process.env.BACKEND_API_BASE_URL : "/"

export const useAuthStore = create((set,get)=>({
   token: localStorage.getItem("token") || null,
   authUser : null,

   isSigningup:false,
   isLoggingin:false,
   isUpdatingprofile :false,

   login : async()=>{

   },
   

   signup: async()=>{

   },
}))