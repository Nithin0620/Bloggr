import React, { useState } from "react";
import { FaRegBell, FaRegClock, FaCheckCircle } from "react-icons/fa";
import { IoLanguageSharp, IoInvertModeSharp } from "react-icons/io5";
import { FaAffiliatetheme } from "react-icons/fa";
import { CiSaveDown2 } from "react-icons/ci";
import { useSettingsStore } from "../store/SettingsStore";
import { toast } from "react-hot-toast";
import EditProfileRight from "../components/EditProfileRight";

const EditPreferences = () => {
  const { mode, theme } = useSettingsStore();

  const [language, setLanguage] = useState("English");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoSave, setAutoSave] = useState(false);

  const handleSavePreferences = () => {
    toast.success("Preferences Saved!");
    // Save logic here
  };

  return (
    <div className="p-4">
      <div className="flex sm:flex-row flex-col gap-6 transition-colors duration-300 accent-text-mode accent-bg-mode">
        <div className="sm:w-[70%] w-full space-y-6">
          <h1 className="text-xl font-semibold accent-text underline underline-offset-4">
            Your Preferences & Settings
          </h1>

          {/* Language Selection */}
          <div className="space-y-2">
            <label className="block font-medium mb-1">Language</label>
            <div className="flex items-center gap-2 border px-3 py-2 rounded">
              <IoLanguageSharp className="text-xl" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-transparent outline-none"
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
          </div>

          {/* Timezone */}
          <div className="space-y-2">
            <label className="block font-medium mb-1">Timezone</label>
            <div className="flex items-center gap-2 border px-3 py-2 rounded">
              <FaRegClock className="text-xl" />
              <input
                type="text"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                placeholder="Timezone"
                className="w-full outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Notifications */}
          <div className="space-y-2">
            <label className="block font-medium mb-1">Notifications</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`px-4 py-1 rounded ${
                  notificationsEnabled ? "accent-bg text-white" : "border accent-border"
                }`}
              >
                {notificationsEnabled ? "Enabled" : "Disabled"}
              </button>
              <FaRegBell className="text-lg" />
            </div>
          </div>

          {/* Auto Save */}
          <div className="space-y-2">
            <label className="block font-medium mb-1">Auto Save</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setAutoSave(!autoSave)}
                className={`px-4 py-1 rounded ${
                  autoSave ? "accent-bg text-white" : "border accent-border"
                }`}
              >
                {autoSave ? "On" : "Off"}
              </button>
              <FaCheckCircle className="text-lg" />
            </div>
          </div>

          {/* Mode & Theme */}
          <div
            className="flex flex-col gap-2 cursor-pointer"
            onClick={() => toast("Change mode and theme from global settings.")}
          >
            <div className="flex items-center gap-2">
              <FaAffiliatetheme /> Theme:{" "}
              <span className="accent-text">{theme || "default"}</span>
            </div>
            <div className="flex items-center gap-2">
              <IoInvertModeSharp /> Mode:{" "}
              <span className="accent-text">{mode || "light"}</span>
            </div>
          </div>

          {/* Save Button */}
          <div>
            <button
              onClick={handleSavePreferences}
              className="mt-4 flex items-center gap-2 px-6 py-2 rounded-full accent-bg text-white"
            >
              <CiSaveDown2 /> Save Preferences
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="sm:w-[30%] w-full">
          <EditProfileRight />
        </div>
      </div>
    </div>
  );
};

export default EditPreferences;
