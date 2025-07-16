import React, { useEffect, useState } from 'react';
import { IoMdClose } from "react-icons/io";
import { BiLogOut } from "react-icons/bi";
import { CiSaveUp1 } from "react-icons/ci";
import { applyTheme } from '../utility/SetColours';

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

   const [mode, setMode] = useState("Light");
   const [theme, setTheme] = useState("Green");
   const [categories, setCategories] = useState(["Tect","Health","AI","Latest News"]);
   const [feed, setFeed] = useState("All");
   const [selectedCategories, setSelectedCategories] = useState([]);
   const [notifications, setNotifications] = useState({
      push: false,
      email: false
   });

   const handleModeSelect = (value) => {
      if (value === "default") setMode(isDarkMode ? "Dark" : "Light");
      else setMode(value);
   };

   const handleThemeSelect = (Theme) => {
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
      if(selectedCategories.length > 0) setFeed("");
   }, [selectedCategories]);

   useEffect(() => {
      if (feed !== "") setSelectedCategories([]);
   }, [feed]);

   const resetButtonHandler = () => {};
   const logoutHandler = () => {};
   const setSettingsHandler = () => {};

   return (
   <div className="min-h-screen mb-12 flex items-center justify-center bg-transparent px-4">
      <div className="w-full max-w-2xl border accent-border rounded-lg p-8 space-y-8 shadow-accent-box ">
         
         {/* Mode */}
         <div className=''>
            <p className="text-lg font-semibold mb-2">Dark/Light Mode</p>
            <select
               className="w-full border accent-border rounded px-4 py-2"
               onChange={(e) => handleModeSelect(e.target.value)}
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
                     className={`px-4 py-2 border rounded-full cursor-pointer transition-all duration-350
                        ${theme === color ? `accent-border ${colorMap[color]}  accent-box-shadow ring-2 ring-offset-2` : ""}
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
                     onChange={() => setFeed("All")}
                  />
                  All
               </label>

               <label className="flex items-center gap-2">
                  <input
                     type="checkbox"
                     checked={feed === "Followed"}
                     onChange={() => setFeed("Followed")}
                  />
                  Followed
               </label>

               <select
                  className="border accent-border rounded px-3 py-1"
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
               <CiSaveUp1 className='mr-1'/>Save Settings
            </button>
         </div>

         {/* Reset Button */}
         <div>
            <button
               onClick={resetButtonHandler}
               className="px-4 py-2 border rounded w-full accent-border hover:accent-bg-light hover:shadow-md"
            >
               Reset Settings
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
