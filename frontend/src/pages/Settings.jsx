import React, { use, useEffect, useState } from 'react';
import { IoMdClose } from "react-icons/io";
import { BiLogOut } from "react-icons/bi";
import { CiSaveUp1 } from "react-icons/ci";
import { applyMode, applyTheme } from '../lib/SetColours';
import { useAuthStore } from '../store/AuthStore';
import { useSettingsStore } from '../store/SettingsStore';
import {Loader} from "lucide-react"
import {toast} from "react-hot-toast"
const Settings = () => {
   const colorMap = {
      Green: 'ring-green-300',
      Blue: 'ring-blue-300',
      Red: 'ring-red-300',
      Black: 'ring-gray-500',
      Beige: 'ring-orange-200',
      Yellow: 'ring-yellow-300',
   };

   const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

   const {getSettings,setSettings,resetSettings} = useSettingsStore();

   const [mode, setMode] = useState("");
   const [theme, setTheme] = useState("");
   const [categories, setCategories] = useState(["Tect","Health","AI","Latest News"]);
   const [feed, setFeed] = useState("All");
   const [selectedCategories, setSelectedCategories] = useState([]);
   const [notifications, setNotifications] = useState({
      push: false,
      email: false
   });

   const [loading,setLoading] = useState(false);
   const [resetLoading,setResetLoading] = useState(false);

   const {logout ,setIsLogoutModalOpen} = useAuthStore();

    const getSettingsOnRender = async()=>{
      setLoading(true);
      const response = await getSettings();
      // console.log("response",response)

      if(response){
         setTheme(response.theme);
         setMode(response.mode);
         if(response.homeFeedType[0] === "All") setFeed("All");
         else if(response.homeFeedType[0] === "Followed" ) setFeed("Followed");
         else {
            setSelectedCategories(response.homeFeedType)
         }
         setNotifications({email:response.emailNotification,push:response.pushNotification});
         setLoading(false);
      }
   }

   useEffect(()=>{

     
      getSettingsOnRender();
      const theme = localStorage.getItem("accent-theme");
      if(theme) setTheme(theme);
   },[])

   useEffect(()=>{
      applyMode(mode);
   },[mode])

   const handleModeSelect = (value) => {
      toast("Please do save the settings. so that we can remember your choice.✨", {
         duration: 4000,
         icon: "📖",
         style: {
            background: "#fff3cd",
            color: "#856404",
         //   border: "1px solid #ffeeba",
            border: "1px solid #334155",
            padding: "12px 18px",
            fontWeight: "500",
            fontSize: "0.9rem",
         },
         ariaProps: {
            role: "status",
            "aria-live": "polite",
         },
      });
      if (value === "default") setMode(isDarkMode ? "Dark" : "Light");
      else setMode(value);
   };

   const handleThemeSelect = (Theme) => {
      toast("Please do save the settings. so that we can remember your choice.✨", {
         duration: 4000,
         icon: "📖",
         style: {
            background: "#fff3cd",
            color: "#856404",
         //   border: "1px solid #ffeeba",
            border: "1px solid #334155",
            padding: "12px 18px",
            fontWeight: "500",
            fontSize: "0.9rem",
         },
         ariaProps: {
            role: "status",
            "aria-live": "polite",
         },
      });
      setTheme(Theme);
      applyTheme(Theme);
   };

   const handleCategorySelect = (categoryName) => {
      if (!selectedCategories.includes(categoryName)) {
         setSelectedCategories((prev) => [...prev, categoryName]);
      }
   };

   const handleCategoryRemove = (categoryName) => {
      setSelectedCategories((prev) =>
         prev.filter((name) => name !== categoryName)
      );
   };

   useEffect(() => {
      if(selectedCategories.length > 0) setFeed(null);
      else if(selectedCategories.length=== 0 ) setFeed("All")
   }, [selectedCategories]);

   useEffect(() => {
      if (feed) setSelectedCategories([]);
   }, [feed]);

   const resetButtonHandler = async() => {
      setResetLoading(true);
      const response = await resetSettings();
      getSettingsOnRender();
      setResetLoading(false);

   };
   const logoutHandler = () => {
      setIsLogoutModalOpen(true)
   };
   const setSettingsHandler = async() => {
      setLoading(true);
      const response  = await setSettings({mode:mode,theme:theme,pushNotification:notifications.push , emailNotification:notifications.email , homeFeedType:feed || selectedCategories});

      setLoading(false);

   };

   return (
   <div className="min-h-screen pb-14  flex items-center top-0 justify-center bg-transparent px-4 transition-colors duration-300 accent-bg-mode accent-text-mode pt-[4.75rem]">
      <div className="w-full max-w-2xl border accent-border rounded-lg p-8 space-y-8 shadow-accent-box ">
         
         {/* Mode */}
         <div className=''>
            <p className="text-lg font-semibold mb-2">Dark/Light Mode</p>
            <select
               className="w-full border accent-border rounded px-4 py-2 transition-colors duration-300 accent-bg-mode accent-text-mode "
               onChange={(e) => handleModeSelect(e.target.value)}
               value={mode}
            >
               <option value="Light">Light</option>
               <option value="Dark">Dark</option>
               <option value="default">System Default</option>
            </select>
         </div>

         <div className="w-full h-[1px] accent-border" />

         {/* Theme */}
         <div>
            <h1 className="text-lg font-semibold mb-2">Colour Theme</h1>
            <div className="flex flex-wrap gap-3">
               {["Green", "Blue", "Red", "Black", "Beige", "Yellow"].map((color) => (
                  <div
                     key={color}
                     onClick={() => handleThemeSelect(color)}
                     className={`px-4 py-[0.4rem]  rounded-full cursor-pointer transition-all duration-350
                        ${theme === color ? ` ${colorMap[color]} accent-border ring-2 ring-offset-2` : ""}
                     `}
                  >
                     {color}
                  </div>
               ))}
            </div>
         </div>

         <div className="w-full h-[1px] accent-border" />

         {/* Push Notifications */}
         <div>
            <h1 className="text-base font-semibold mb-2">
               Do you want to receive Push Notifications in real time when you're online?
            </h1>
            <div className="flex items-center gap-2">
               <input
                  type="radio"
                  name="pushNotification"
                  checked={notifications.push}
                  onChange={() => setNotifications(prev => ({ ...prev, push: true }))}
               />
               <label>Yes</label>
               <input
                  type="radio"
                  name="pushNotification"
                  checked={!notifications.push}
                  onChange={() => setNotifications(prev => ({ ...prev, push: false }))}
               />
               <label>No</label>
            </div>
         </div>

         {/* Email Notifications */}
         <div>
            <h1 className="text-base font-semibold mb-2">
               Do you want to receive Email Notifications in real time?
            </h1>
            <div className="flex items-center gap-2">
               <input
                  type="radio"
                  name="emailNotification"
                  checked={notifications.email}
                  onChange={() => setNotifications(prev => ({ ...prev, email: true }))}
               />
               <label htmlFor='emailNotification'>Yes</label>
               <input
                  type="radio"
                  name="emailNotification"
                  checked={!notifications.email}
                  onChange={() => setNotifications(prev => ({ ...prev, email: false }))}
               />
               <label htmlFor='emailNotification'>No</label>
            </div>
         </div>

         <div className="w-full h-[1px] accent-border" />

         {/* Feed Preference */}
         <div>
            <h1 className="text-base font-semibold mb-2">
               What type of Feed Recommendations do you want?
            </h1>
            <div className="flex flex-wrap gap-4 items-center">
               <label className="flex items-center gap-2">
                  <input
                     type="checkbox"
                     checked={feed === "All"}
                     onClick={() => setFeed("All")}
                  />
                  All
               </label>

               <label className="flex items-center gap-2">
                  <input
                     type="checkbox"
                     checked={feed === "Followed"}
                     onClick={() => setFeed("Followed")}
                  />
                  Followed
               </label>

               <select
                  className="border accent-border rounded px-3 py-1 select:border-none transition-colors duration-300 accent-bg-mode accent-text-mode"
                  value={selectedCategories.length > 0 ? selectedCategories[selectedCategories.length - 1] : ""}
                  onChange={(e) => handleCategorySelect(e.target.value)}
               >
                  <option value="" disabled>Select Categories Instead</option>
                  {categories.map((category, index) => (
                     <option key={index} value={category}>
                        {category}
                     </option>
                  ))}
               </select>
            </div>

            {/* Selected Categories */}
            {selectedCategories.length > 0 && (
               <div className="mt-4 flex flex-wrap gap-2">
                  {selectedCategories.map((category, index) => (
                     <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-1 border rounded-full accent-border accent-text bg-opacity-10 accent-bg-light"
                     >
                        {category}
                        <IoMdClose
                           className="cursor-pointer hover:scale-110 transition"
                           onClick={() => handleCategoryRemove(category)}
                        />
                     </div>
                  ))}
               </div>
            )}
         </div>

         <div className="w-full h-[1px] accent-border" />

         {/* Save Settings */}
         <div>
            <button
               onClick={setSettingsHandler}
               className="px-4 py-2 border rounded w-full flex items-center justify-center accent-border hover:accent-bg-light hover:shadow-md"
            >
               {loading ? <div><Loader className='animate-spin'/></div> : <div className='flex items-center gap-2'><CiSaveUp1 className='mr-1'/>Save Settings</div>}
            </button>
         </div>

         {/* Reset Button */}
         <div>
            <button
               onClick={resetButtonHandler}
               className="px-4 py-2 border rounded w-full accent-border hover:accent-bg-light hover:shadow-md"
            >
               {resetLoading ? <div className='flex justify-center items-center'><Loader className='animate-spin'/></div> : <div className='flex justify-center items-center gap-2'>Reset Settings</div>}
            </button>
         </div>

         {/* Logout */}
         <div
            onClick={logoutHandler}
            className="bg-red-600 hover:scale-95 transition-all duration-200 flex items-center justify-center gap-3 text-yellow-50 hover:text-amber-100 cursor-pointer font-semibold px-4 py-2 border rounded-3xl hover:shadow w-full"
         >
            <BiLogOut className='font-semibold text-xl'/>
            Logout
         </div>
      </div>
   </div>
);

};

export default Settings;