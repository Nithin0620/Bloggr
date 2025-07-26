import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";

const EditProfile = ({ editProfile, setEditProfile, onSubmit, initialValues = {} }) => {
  const [formData, setFormData] = useState({
    firstName: initialValues.firstName || "",
    lastName: initialValues.lastName || "",
    email: initialValues.email || "",
    bio: initialValues.bio || "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleConfirm = () => setShowConfirm((prev) => !prev);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    onSubmit(formData);
    setEditProfile(false);
  };

  if (!editProfile) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
      <div className="accent-bg-mode accent-text-mode rounded-xl p-6 w-full max-w-lg shadow-accent-box relative">
       <button
            className="absolute hover:rotate-90 hover:scale-75 transition-all duration-500 top-4 right-4 text-2xl text-red-500"
            onClick={() => setEditProfile(false)}
         >
            <IoMdClose />
         </button>
        <h2 className="text-xl font-semibold mb-6 text-center accent-text">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="grid gap-5">
          {/* First Name */}
          <div className="relative">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full border p-2 pr-10 rounded-md accent-bg-mode accent-border accent-text-mode"
              required
            />
            <CiEdit className="absolute right-3 top-3 text-xl text-gray-500" />
          </div>

          {/* Last Name */}
          <div className="relative">
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full border p-2 pr-10 rounded-md accent-bg-mode accent-border accent-text-mode"
              required
            />
            <CiEdit className="absolute right-3 top-3 text-xl text-gray-500" />
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border p-2 pr-10 rounded-md accent-bg-mode accent-border accent-text-mode"
              required
            />
            <CiEdit className="absolute right-3 top-3 text-xl text-gray-500" />
          </div>

          {/* Bio */}
          <div className="relative">
            <textarea
              name="bio"
              placeholder="Bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full border p-2 pr-10 rounded-md accent-bg-mode accent-border accent-text-mode resize-none"
              rows={3}
            />
            <CiEdit className="absolute right-3 top-3 text-xl text-gray-500" />
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="New Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border p-2 pr-10 rounded-md accent-bg-mode accent-border accent-text-mode"
            />
            <button
              type="button"
              onClick={togglePassword}
              className="absolute right-3 top-3 text-xl text-gray-500"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border p-2 pr-10 rounded-md accent-bg-mode accent-border accent-text-mode"
            />
            <button
              type="button"
              onClick={toggleConfirm}
              className="absolute right-3 top-3 text-xl text-gray-500"
            >
              {showConfirm ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <button
            type="submit"
            className="accent-bg text-white py-2 rounded-md hover:bg-[var(--accent-bg-dark)] transition"
          >
            Edit Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
