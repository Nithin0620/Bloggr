import {create} from "zustand"

export const usePageStore = create((get,set)=>({
   navigate:null,
   currentPage : null,
   setCurrentPage : (page)=>{
      set({currentPage:page});
      // console.log(get().currentPage)
   },
   setNavigate : (navigate)=>{
      set({navigate:navigate});
   }
}))