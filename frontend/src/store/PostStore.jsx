import { create } from "zustand";
import axios from "axios";
import {toast} from "react-hot-toast"

const BASE_URL = process.env.REACT_APP_MODE === "development" ? "http://localhost:4000/api" : "/api";


export const usePostStore = create((get,set)=>({
  createPostLoading : false,
  updatePostLoading : false,

  readMorePostData:null,
  isReadMoreLoading:false,
  categoriesList: [],

  posts:[],

  setPosts : async()=>{

  },

  fetchCategories: async () => {
    set({createPostLoading:true});
    try{
      const res = await axios.get(`${BASE_URL}/category/getallcategory`);
      
     if (res.data.success) {
        const categoryArray = res.data.data.map(category => category.name);
        set({ categoriesList: categoryArray });
        return categoryArray;
      }

      // console.log(get().categoryList)
    }
    catch(e){
      // console.log(e);
      return [];
    }
    set({createPostLoading:false});

  },

  fetchPostsByCategories: async (e) => {
    set({createPostLoading:true});
    try{
      // console.log("in store",e);
      const res = await axios.get(`${BASE_URL}/category/getpostsbycategory/${e}`);
      // console.log("response in fetch post by category",res);
     if (res.data.success) {
        const categoryPostArray = res.data.data;
        return categoryPostArray;
      }

      // console.log(get().categoryList)
    }
    catch(e){
      // console.log(e);
      toast.error("Unable to fetch post by category!")
      return [];
    }
    set({createPostLoading:false});
  },
  createCategory : async(data)=>{
    try{
      // console.log(data)
      const response = await axios.post(`${BASE_URL}/category/createcategory`,{categoryName:data});
      // console.log("respone for create category",response);

      if(response.data.success){
        toast.success("New Category Created Successfully!")
        return true;
      }
      else {
        toast.error("Unable to create New category. pls try again after some time.");
        return false;
      }
    }
    catch(e){
      // console.log(e);
      toast.error(e.response.data.message)
      // toast.error("Unable to create New category. pls try again after some time.");
      return false;
    }
  },

  // getCategories : ()=>{
  //   return get().categoriesList;
  // },

  fetchPosts : async()=>{
    set({fetchPostLoading:true});
    try{
      const response =  await axios.get(`${BASE_URL}/post/getallposts`);
      // console.log("response",response.data.data);
      set({posts:response.data.data})
      return response.data.data;
      // console.log(get().posts);
    }
    catch(e){
      // console.log(e);
      toast.error(e.response.data.message)
      return [];
    }
    finally{
      set({fetchPostLoading:false});

    }
  },



  getPostByID : async(postId)=>{
    set({isReadMoreLoading:true});
    try{
      // console.log("in the store")
      const response =  await axios.get(`${BASE_URL}/post/getpostbyid/${postId}`);
      // console.log("response in the from id:",response.data.data);
      set({readMorePostData:response.data.data})
      return response.data.data;
      // console.log(get().posts);
    }
    catch(e){
      // console.log(e);
      toast.error(e.response.data.message);
      return [];
    }
    finally{
      set({isReadMoreLoading:false});
    }
  },

  getComments : async(id)=>{
    try{
      const response = await axios.get(`${BASE_URL}/interactions/getcomments/${id}`)
      // console.log("comments,:" , response.data);
      return response.data;
    }
    catch(e){
      // console.log(e)
      
      return [];
    }
  },

  sendComment :async(data,postId)=>{
    try{
      const response  = await axios.post(`${BASE_URL}/interactions/addcomment/${postId}`,data);

      if(response.data.success){
        toast.success("comment added Successfully");
      }
      else{
        toast.error("Unable to add comment, Please try again after sometime");
      }
    }
    catch(e){
      // console.log(e);
    }
  },

  deleteComment:async(id,commentId)=>{
    try{
      const response  = await axios.delete(`${BASE_URL}/interactions/deletecomment/${id}/${commentId}`);
      // console.log(response)

      if(response.data.success){
        toast.success("comment Deleted Successfully");
      }
      else{
        toast.error("Unable to Delete comment, Please try again after sometime");
      }
    }
    catch(e){
      // console.log(e);
    }
  },

  createPost: async (formData) => {
    set({createPostLoading:true});
    try{
      const res = await axios.post(
        `${BASE_URL}/post/createpost`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Let Axios handle boundary
          },
          withCredentials: true, // if using cookies for auth
        }
      );
      // console.log(res)
      if(res.data.success){
        toast.success("New Blog posted successfully.")
        return true;
      }
      else{
        toast.error("Error occured in posting the Blog!")
        toast("please Try again after sometime!")
        return false;
      }
    }
    catch(e){
      // console.log(e)
      toast.error("Error occured in posting the Blog!",e.response.data.message)
      return false;
    }
    finally{
      set({createPostLoading:false});

    }
  },
  updatePost: async (formData,postId) => {
    // console.log("formData");
    // for (let pair of formData.entries()) {
    //   console.log(pair[0] + ": " + pair[1]);
    //   }
    set({updatePostLoading:true});
    try{
      const res = await axios.put(
        `${BASE_URL}/post/updatepost/${postId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", 
          },
          withCredentials: true,
        }
      );
      // console.log(res)
      if(res.data.success){
        toast.success(" Blog updated successfully.")
        // return res.data.data;
      }
      else{
        toast.error("Error occured in posting the Blog!")
        toast("please Try again after sometime!")
        // return [];
      }
    }
    catch(e){
      // console.log(e)
      // toast.error(e.response.data.message)
      toast.error("Error occured in posting the Blog!",e.response.data.message)
    }
    finally{
      set({updatePostLoading:false});

    }
  },
  deletePost : async(id)=>{
    try{
      const response = await axios.delete(`${BASE_URL}/post/deletepost/${id}`)

      if(response.data.success){
        return true;
      }
      else{return false};

    }
    catch(e){
      toast.error(e.response.data.message)
      // console.log(e);
    }
  }

}))   