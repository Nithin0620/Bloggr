import React, { useRef, useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { FiUpload } from "react-icons/fi";
import { useAuthStore } from "../store/AuthStore";
import { BiPencil } from "react-icons/bi";
import { CgRename } from "react-icons/cg";
import { MdOutlineMailOutline } from "react-icons/md";
import { IoEyeSharp, IoEyeOffSharp, IoInvertModeSharp } from "react-icons/io5";
import { FaAffiliatetheme } from "react-icons/fa";
import { useSettingsStore } from "../store/SettingsStore";
import { toast } from "react-hot-toast";
import { CiSaveDown2 } from "react-icons/ci";
import EditProfileRight from "../components/EditProfileRight";

const EditProfile = () => {
  const imageRef = useRef();
  const { authUser } = useAuthStore();
  const { mode, theme } = useSettingsStore();

  
  const [photoSelect, setPhotoSelect] = useState();
  const [firstName, setFirstName] = useState(authUser.firstName);
  const [lastName, setLastName] = useState(authUser.lastName);
  const [email, setEmail] = useState(authUser.email);
  const [newPassword, setNewPassword] = useState("");
  const [newConfirmPassword, setNewConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [bio, setBio] = useState(authUser.profile.bio);
  
  const handleImageUpload = () => {};
  const handleSaveChanges = () => {};
  return (
    <div>
      {
        !authUser && (<div>Loading...</div>)
      }
    </div>
  )
  

  // if(!authUser) return(
  //   <div>Loading...</div>
  // )

  return (
    <div className="min-h-screen accent-bg-mode accent-text-mode py-8 px-4">
      <div className="w-[85%] mx-auto flex flex-col md:flex-row gap-10">
        {/* Left Panel */}
        <div className="md:w-[70%] w-full space-y-8">
          <h1 className="text-2xl font-semibold accent-text underline underline-offset-4">
            Edit Your Profile
          </h1>

          {/* Profile Picture */}
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-medium">Profile Picture</h2>
            <div className="flex items-center gap-4 flex-wrap">
              {photoSelect && (
                <img
                  src={photoSelect}
                  alt="preview"
                  className="w-20 h-20 rounded-full object-cover border border-gray-300"
                />
              )}
              {photoSelect && <FaArrowRightLong className="text-xl" />}
              <img
                src={authUser.profilePic || "./avatar.png"}
                alt="current"
                className="w-20 h-20 rounded-full object-cover border"
              />
            </div>

            <div className="flex items-center gap-4 mt-2">
              <input
                type="file"
                accept="image/*"
                ref={imageRef}
                onChange={(e) => setPhotoSelect(URL.createObjectURL(e.target.files[0]))}
                className="hidden"
              />
              <button
                onClick={() => imageRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 border rounded-md accent-border"
              >
                <FiUpload /> Select
              </button>
              <button
                onClick={handleImageUpload}
                className="px-4 py-2 rounded-md accent-bg text-white hover:opacity-90"
              >
                Upload
              </button>
            </div>
          </div>

          {/* Name and Email */}
          <div className="space-y-6">
            {[
              { label: "First Name", icon: <CgRename />, value: firstName, set: setFirstName },
              { label: "Last Name", icon: <CgRename />, value: lastName, set: setLastName },
              { label: "Email", icon: <MdOutlineMailOutline />, value: email, set: setEmail },
            ].map(({ label, icon, value, set }) => (
              <div key={label}>
                <label className="block text-sm font-medium mb-1">{label}</label>
                <div className="flex items-center border rounded-md px-2 accent-border">
                  <span className="text-xl mr-2">{icon}</span>
                  <input
                    type={label === "Email" ? "email" : "text"}
                    value={value}
                    onChange={(e) => set(e.target.value)}
                    className="w-full py-2 bg-transparent outline-none"
                    placeholder={label}
                  />
                  <BiPencil className="text-gray-500" />
                </div>
              </div>
            ))}
          </div>

          {/* Password Fields */}
          <div className="grid sm:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium mb-1">New Password</label>
              <div className="flex items-center border rounded-md px-2 accent-border">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full py-2 bg-transparent outline-none"
                  placeholder="New Password"
                />
                <button onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <IoEyeOffSharp /> : <IoEyeSharp />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Confirm Password</label>
              <div className="flex items-center border rounded-md px-2 accent-border">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={newConfirmPassword}
                  onChange={(e) => setNewConfirmPassword(e.target.value)}
                  className="w-full py-2 bg-transparent outline-none"
                  placeholder="Confirm Password"
                />
                <button onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <IoEyeOffSharp /> : <IoEyeSharp />}
                </button>
              </div>
            </div>
          </div>

          {/* About Me */}
          <div className="mt-6">
            <label className="block text-sm font-medium mb-1">About Me</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full p-2 border rounded-md accent-border bg-transparent resize-none outline-none"
            />
          </div>

          {/* Theme + Mode (disabled) */}
          <div
            onClick={() => toast.warning("Set Mode/Theme From Settings!")}
            className="flex gap-4 items-center text-sm mt-4 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <FaAffiliatetheme /> Theme:{" "}
              <span className="font-semibold accent-text">{theme}</span>
            </div>
            <div className="flex items-center gap-2">
              <IoInvertModeSharp /> Mode:{" "}
              <span className="font-semibold accent-text">{mode}</span>
            </div>
          </div>

          {/* Save Button */}
          <div>
            <button
              onClick={handleSaveChanges}
              className="mt-6 flex items-center gap-2 px-6 py-2 rounded-full accent-bg text-white hover:opacity-90 transition"
            >
              <CiSaveDown2 /> Save Changes
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="md:w-[30%] w-full">
          <EditProfileRight />
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
