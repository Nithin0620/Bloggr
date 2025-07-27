import React, { useEffect, useState } from "react";
// import { useAuthStore } from "../store/AuthStore";
// import { useNavigate } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import HeroCard from "../components/HeroCard";
import HomePostCards from "../components/HomePostCards";
import { useAuthStore } from "../store/AuthStore";
import { usePostStore } from "../store/PostStore";
import{Loader} from "lucide-react"
import { useIntractionStore } from "../store/IntractionStore";
import { useSettingsStore } from "../store/SettingsStore";
import { usePageStore } from "../store/PageStore";
import { FaPlus } from "react-icons/fa6";
import AddCategoryModal from "../components/AddCategoryModal ";
import toast from "react-hot-toast";

const Home = () => {
    // const {createPostLoading} = usePostStore();


  const [liked,setLiked] = useState(false);

  const {token,authUser} = useAuthStore();

  const {getSettings} = useSettingsStore();

  const {isCreatePostOpen} = usePageStore();  
  
  const {getAllPostLikedByCurrentUser} = useIntractionStore();
  
  const { fetchCategories, categoriesList,posts,fetchPosts ,createPostLoading , fetchPostsByCategories} = usePostStore();
  const [categories,setCategories] = useState([]);
  const [Post,setPost] = useState([]);
  const [PostCopy,setPostCopy] = useState([]);
  const[loading , setLoading] = useState(false);

  const [categoryCreated,setCategoryCreated] = useState(false);

  const fetchCategoryAndPostfromStore = async()=>{
      setLoading(true);
      const array = await fetchCategories();
      const PostArray = await fetchPosts();
      setCategorySelected("All Categories");
      setPost(PostArray);
      setPostCopy(PostArray);
      setCategories(array);
      setLoading(false);
      setLiked(false);
      
    }

  useEffect(() => {
    setCategoryCreated(false);
    const getSettingsOnRender = async()=>{
      // if(!token) return;
      // console.log("here in app")
      await getSettings();
      // console.log("response in app",response)
    }
    getSettingsOnRender();
    setCategorySelected("All Categories")

    getAllPostLikedByCurrentUser();
    
    fetchCategoryAndPostfromStore(); 
  }, [fetchCategories,categoriesList,fetchPosts,posts,liked,createPostLoading,isCreatePostOpen,categoryCreated]);

  const [categorySelected,setCategorySelected] = useState("");

  const fetchCategoryWisePost = async(e)=>{
    setLoading(true);
    const CategoryArray = await fetchPostsByCategories(e);
    setPost(CategoryArray);
    setLoading(false);
  }

  const handleCategorySelect = async(e)=>{
    // console.log(e.target.value === "All Categories");
    if(categorySelected === e.target.value) return;
    if(e.target.value === "All Categories") fetchCategoryAndPostfromStore();
    else{
      setCategorySelected(e.target.value);
      fetchCategoryWisePost(e.target.value);
    }
  }

  const [addCategoryOpen,setAddCategoryOpen] = useState(false);

  // useEffect(() => {
  //   console.log("categories updated:", categoriesList);
  //   setCategories(categoriesList);
  //   console.log(categoriesList);
  // }, [categoriesList]);


  // search Functionality
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = (e) => {
    const value = e.target.value;
    const query = value.toLowerCase();
    setSearchTerm(value);

    if (query === "") {
      setPost(PostCopy); 
      return;
    }

    const filteredPost = PostCopy.filter((post) => {
      const title = typeof post.title === "string" ? post.title.toLowerCase() : "";
      const content = typeof post.content === "string" ? post.content.toLowerCase() : "";
      const authorName = typeof post.author.firstName + " " + post.author.lastName === "string" ? post.author.firstName.toLowerCase() + " " +   post.author.lastName.toLowerCase() : "" ;
      const authorFirstName = typeof post.author.firstName === "string" ? post.author.firstName.toLowerCase() : "" ;
      const authorLastName = typeof post.author.lastName === "string" ? post.author.lastName.toLowerCase() : "" ;

      return (
        authorName.includes(query) ||
        authorFirstName.includes(query) ||
        authorLastName.includes(query) ||
        title.includes(query) || 
        content.includes(query)
      );
    });
    setPost(filteredPost);
  };


  const handleAddCategory = ()=>{
    if(!token && !authUser){
      toast.error("Please Login to access this feature.")
      return;
    }
    setAddCategoryOpen(true)
  }

  

  return (
    <div className="flex justify-center custom-scroll p-2 transition-colors duration-300 accent-bg-mode accent-text-mode">
      <div className="w-[85%] rounded-3xl flex flex-col items-center lg:px-12 px-4 py-2 min-h-screen shadow-accent-box border accent-border transition-colors duration-300 accent-bg-mode accent-text-mode">
        
        <HeroCard />

        <div className="w-[98%] mx-auto rounded-xl shadow shadow-accent p-4 mt-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition-colors duration-300 accent-bg-mode accent-text-mode">
          <div className="flex items-center w-full md:w-[66%]  rounded-md px-4 py-2 shadow-inner accent-box-shadow border accent-border">
            <IoSearch className=" text-lg transition-colors duration-300 accent-bg-mode accent-text-mode" />
            <div className="mx-2 h-6 w-[1.5px] ml-4 transition-colors duration-300 bg-gray-400 accent-text-mode" ></div>
            <input
              type="search"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search posts or authors ..."
              className="ml-3 w-full bg-transparent text-sm outline-none placeholder-gray-500"
            />

          </div>

          <div className="w-full flex md:w-[38%] transition-colors gap-3 duration-300 accent-bg-mode accent-text-mode">
            <select value={categorySelected} onChange={(e)=>handleCategorySelect(e)} className="hover:scale-[1.01] hover:-translate-y-[0.07rem] cursor-pointer transition-all duration-300 text-sm pl-2 pr-4 py-2 border accent-border rounded-md shadow-sm  accent-bg-mode accent-text-mode">
              <option value="All Categories">All Categories</option>
              {categories.map((category, index) => (
                <option title={category} key={index} value={category}>
                  {
                    category.length > 12 ? category.substr(0,12) + "..." : category
                  }
                </option>
              ))}
            </select>

            <button onClick={handleAddCategory} className="text-sm hover:scale-105 cursor-pointer transition-all duration-300 flex items-center px-2 gap-1 py-2 border accent-border rounded-md shadow-sm  accent-bg-mode accent-text-mode ">
                <FaPlus/> <p>Add new Category</p>
            </button>
          </div>

          {/* <div className="flex items center">
            
          </div> */}
        </div>

        

       <div className="relative min-h-screen">
        {
          Post.length === 0 && (
            <div className="absolute inset-0 flex justify-center items-cente z-10">
              <p className="flex justify-evenly text-center">
                No Post Yet! why Don't you create One 😏.
              </p>
            </div>
          )
        }
        {loading && (
          <div className="absolute backdrop-blur-sm inset-0 flex justify-center items-cente z-10">
            <div >
              <Loader className="animate-spin" />
            </div>
          </div>
        )}

        <div
          id="PostSection"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {Post.map((post, index) => (
            <HomePostCards key={index} post={post} setLiked={setLiked} />
          ))}
        </div>
      </div>
       
      </div>

      <AddCategoryModal
        isOpen={addCategoryOpen}
        setAddCategoryOpen={setAddCategoryOpen}
        setCategoryCreated={setCategoryCreated}
      />
    </div>
  );
};

export default Home;
