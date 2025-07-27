import {create } from "zustand"
import toast from "react-hot-toast";
import axios from "axios";
import { applyMode, applyTheme } from "../lib/SetColours";

const BASE_URL = process.env.REACT_APP_MODE === "development" ? "http://localhost:4000/api" : "/api";


export const useSettingsStore = create((get,set)=>({
   theme:"Green",
   mode:"Light",
   

   setSettings:async(data)=>{
      try{
         const response = await axios.post(`${BASE_URL}/settings/setsettings`,data);

         if(response.data.success){
            toast.success("Settings saved Successfully");
            return true;
         }
         else{
            toast.error("Error in saving the settings, please try again after some time");
            return false;
         }
      }

      catch(e){
         // console.log(e);
         toast.error("Error in saving the settings, please try again after some time");
         return false;
      }
   },
   getSettings : async()=>{
      try{
         const response = await axios.get(`${BASE_URL}/settings/getsettings`)

         if(response.data.success){
            set({theme:response.data.data.theme});
            set({mode:response.data.data.mode});
            localStorage.setItem("accent-theme",response.data.data.theme);
            localStorage.setItem("accent-mode",response.data.data.mode);
            // console.log(response.data.data.theme)
            applyMode(response.data.data.mode);
            applyTheme(response.data.data.theme);
            return response.data.data;
         }
         else return null;
      }
      catch(e){
         
         // console.log("Error occure in the getSettings function",e);
      }
   },

   resetSettings: async()=>{
      try{

         const response = await axios.get(`${BASE_URL}/settings/resetsettings`);
         if(response.data.success){
            toast.success("Settings reset Completed!")
            return true;
         }
         else{
            toast.error("Error occured in resetting the settings!")
            return false;
         }
      }
      catch(e){
         // console.log("error occured in reset settings function:",e);
         toast.error("Error occured in resetting the settings!")
         return false;
      }
   }
}))