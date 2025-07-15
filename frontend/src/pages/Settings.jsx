import React, { useEffect, useState } from 'react';
import { IoMdClose } from "react-icons/io";
import { BiLogOut } from "react-icons/bi";

const Settings = () => {
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
      if(selectedCategories.length>0)setFeed("");
   }, [selectedCategories]);

   useEffect(() => {
      if (feed !== "") setSelectedCategories([]);
   }, [feed]);

   const resetButtonHandler = () => {};
   const logoutHandler = () => {};

   return (
      <div className="min-h-screen mb-12 flex items-center justify-center bg-transparent px-4">
         <div className="w-full max-w-2xl border rounded-lg p-8 space-y-8">
            {/* Mode */}
            <div>
               <p className="text-lg font-semibold mb-2">Dark/Light Mode</p>
               <select
                  className="w-full border rounded px-4 py-2"
                  onChange={(e) => handleModeSelect(e.target.value)}
               >
                  <option value="default">System Default</option>
                  <option value="Dark">Dark</option>
                  <option value="Light">Light</option>
               </select>
            </div>

            <hr />

            {/* Theme */}
            <div>
               <h1 className="text-lg font-semibold mb-2">Colour Theme</h1>
               <div className="flex flex-wrap gap-3">
                  {["Green", "Blue", "Red", "Black", "Beige", "Yellow"].map((color) => (
                     <div
                        key={color}
                        onClick={() => handleThemeSelect(color)}
                        className={`px-4 py-2 border rounded-full cursor-pointer ${
                           theme === color ? "ring-2 ring-offset-2" : ""
                        }`}
                     >
                        {color}
                     </div>
                  ))}
               </div>
            </div>

            <hr />

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

            <hr />

            {/* Feed Preference */}
            <div>
               <h1 className="text-base font-semibold mb-2">
                  What type of Feed Recommendations do you want?
               </h1>
               <div className="flex flex-wrap gap-4 items-center">
                  <label className="flex items-center gap-2">
                     <input
                        type="checkbox"
                        checked={feed === "All"? true: false}
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
                     className="border rounded px-3 py-1"
                     value={selectedCategories.length>0? selectedCategories[selectedCategories.length-1]: ""}
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
                           className="flex items-center gap-2 px-3 py-1 border rounded-full"
                        >
                           {category}
                           <IoMdClose
                              className="cursor-pointer"
                              onClick={() => handleCategoryRemove(category)}
                           />
                        </div>
                     ))}
                  </div>
               )}
            </div>

            <hr />

            {/* Reset Button */}
            <div>
               <button
                  onClick={resetButtonHandler}
                  className="px-4 py-2 border rounded hover:shadow w-full"
               >
                  Reset Settings
               </button>
            </div>

            {/* Logout */}
            <div
               onClick={logoutHandler}
               className="bg-red-600 hover:scale-95 transition-all duration-200 flex items-center justify-center gap-3 text-yellow-50 hover:text-amber-100 cursor-pointer font-semibold px-4 py-2 border rounded-3xl hover:shadow w-full"
            >
               <BiLogOut  className='font-semibold text-xl'/>
               Logout
            </div>
         </div>
      </div>
   );
};

export default Settings;
