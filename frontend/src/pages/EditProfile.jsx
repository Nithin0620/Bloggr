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
  const [newConfirmPassowrd, setNewConfirmPassowrd] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassowrd] = useState(false);
  const [bio, setBio] = useState(authUser.profile.bio);

  const handleImageUpload = () => {};

  const handleSaveChanges = () => {};

  return (
    <div className="p-4">
      <div className="flex sm:flex-row flex-col gap-6 transition-colors duration-300 accent-text-mode accent-bg-mode">
        <div className="sm:w-[70%] w-full space-y-6">
          <h1 className="text-xl font-semibold accent-text underline underline-offset-4">
            Your Profile Information's
          </h1>

          {/* Image Section */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              {photoSelect && (
                <img
                  src={photoSelect}
                  alt="preview"
                  className="w-20 h-20 rounded-full object-cover"
                />
              )}
              {photoSelect && (
                <FaArrowRightLong className="text-xl accent-text" />
              )}
              <img
                src={authUser.profilePic || "./avatar.png"}
                alt="avatar"
                className="w-20 h-20 rounded-full object-cover"
              />
            </div>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                ref={imageRef}
                onChange={(e) =>
                  setPhotoSelect(URL.createObjectURL(e.target.files[0]))
                }
                className="hidden"
              />
              <button
                onClick={() => imageRef.current?.click()}
                className="flex items-center gap-2 px-4 py-1 border rounded accent-border"
              >
                <FiUpload /> Select
              </button>
              <button
                onClick={handleImageUpload}
                className="px-4 py-1 rounded accent-bg text-white"
              >
                Upload
              </button>
            </div>
          </div>

          {/* Input Fields */}
          <div className="space-y-4">
            <label className="block">
              <h1 className="font-medium mb-1">First Name</h1>
              <div className="flex items-center border rounded px-2">
                <CgRename className="text-xl mr-2" />
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="FirstName"
                  className="w-full p-2 outline-none bg-transparent"
                />
                <BiPencil />
              </div>
            </label>
            <label className="block">
              <h1 className="font-medium mb-1">Last Name</h1>
              <div className="flex items-center border rounded px-2">
                <CgRename className="text-xl mr-2" />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="LastName"
                  className="w-full p-2 outline-none bg-transparent"
                />
                <BiPencil />
              </div>
            </label>
            <label className="block">
              <h1 className="font-medium mb-1">Email</h1>
              <div className="flex items-center border rounded px-2">
                <MdOutlineMailOutline className="text-xl mr-2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full p-2 outline-none bg-transparent"
                />
              </div>
            </label>
          </div>

          {/* Password Section */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full">
              <label className="block mb-1">New Password</label>
              <div className="flex items-center border rounded px-2">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  className="w-full p-2 outline-none bg-transparent"
                />
                <div
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer"
                >
                  {showPassword ? <IoEyeOffSharp /> : <IoEyeSharp />}
                </div>
              </div>
            </div>
            <div className="w-full">
              <label className="block mb-1">Confirm Password</label>
              <div className="flex items-center border rounded px-2">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={newConfirmPassowrd}
                  onChange={(e) => setNewConfirmPassowrd(e.target.value)}
                  placeholder="Confirm Password"
                  className="w-full p-2 outline-none bg-transparent"
                />
                <div
                  onClick={() => setShowConfirmPassowrd(!showConfirmPassword)}
                  className="cursor-pointer"
                >
                  {showConfirmPassword ? <IoEyeOffSharp /> : <IoEyeSharp />}
                </div>
              </div>
            </div>
          </div>

          {/* Bio and Theme Info */}
          <div className="space-y-3">
            <div className="font-semibold">{authUser.profile.name}</div>
            <div>
              <h1 className="mb-1">About Me</h1>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-2 border rounded resize-none"
                rows={4}
              ></textarea>
            </div>
            <div
              className="flex flex-col gap-2 cursor-pointer"
              onClick={() => toast.warning("Set Mode/Theme From Settings!")}
            >
              <div className="flex items-center gap-2">
                <FaAffiliatetheme /> Theme:{" "}
                <span className="accent-text">{theme}</span>
              </div>
              <div className="flex items-center gap-2">
                <IoInvertModeSharp /> Mode:{" "}
                <span className="accent-text">{mode}</span>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div>
            <button
              onClick={handleSaveChanges}
              className="mt-4 flex items-center gap-2 px-6 py-2 rounded-full accent-bg text-white"
            >
              <CiSaveDown2 /> Save Changes
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

export default EditProfile;
