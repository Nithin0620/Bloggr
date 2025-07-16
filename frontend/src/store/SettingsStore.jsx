import {create } from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast";

const BASE_URL = process.env.REACT_APP_MODE === "development" ? process.env.BACKEND_API_BASE_URL : "/"


export const useSettingsStore = create((get,set)=>({
   theme:"Green",
   mode:"Light",
   

   setSettings:async()=>{

   },
   getSettings : async()=>{

   }
}))