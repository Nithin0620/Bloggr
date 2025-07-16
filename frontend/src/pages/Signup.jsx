import { React, useState } from "react";
import { useForm } from "react-hook-form";
import { PiEyeSlash } from "react-icons/pi";
import { IoEyeSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignUp = (data) => {
    // handle sign up logic here
  };

  return (
    <div className="min-h-screen mt-5 flex flex-col gap-0 items-center justify-start">
      {/* Card */}
      <div className="w-[95%] max-w-md bg-white shadow-md rounded-xl px-10 py-8 flex flex-col gap-5 accent-border border">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold accent-text">Create your account</h1>
          <p className="text-sm font-serif opacity-90 accent-text">
            Join Bloggr and start sharing your thoughts.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleSignUp)} className="flex flex-col gap-5 relative">
          {/* Name Fields */}
          <div className="flex gap-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="First name"
                {...register("firstName", { required: true })}
                className="w-full px-4 py-2 border accent-border rounded-md text-sm"
              />
              {errors.firstName && (
                <p className="absolute text-xs text-red-500 -mt-1 left-1">
                  First Name is required
                </p>
              )}
            </div>

            <div className="relative w-full">
              <input
                type="text"
                placeholder="Last name"
                {...register("lastName", { required: true })}
                className="w-full px-4 py-2 border accent-border rounded-md text-sm"
              />
              {errors.lastName && (
                <p className="absolute text-xs text-red-500 -mt-1 left-1">
                  Last Name is required
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              placeholder="Email address"
              {...register("email", { required: true })}
              className="w-full px-4 py-2 border accent-border rounded-md text-sm"
            />
            {errors.email && (
              <p className="absolute text-xs text-red-500 -mt-1 left-1">
                Email is required
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password", { required: true })}
              className="w-full px-4 py-2 border accent-border rounded-md text-sm pr-10"
            />
            <div
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <PiEyeSlash /> : <IoEyeSharp />}
            </div>
            {errors.password && (
              <p className="absolute text-xs text-red-500 -mt-1 left-1">
                Password is required
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              {...register("confirmPassword", { required: true })}
              className="w-full px-4 py-2 border accent-border rounded-md text-sm pr-10"
            />
            <div
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <PiEyeSlash /> : <IoEyeSharp />}
            </div>
            {errors.confirmPassword && (
              <p className="absolute text-xs text-red-500 -mt-1 left-1">
                Confirm password is required
              </p>
            )}
          </div>

          {/* Terms of Service */}
          <div className="relative mb-2 mt-1">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                {...register("agreetermsofservice", { required: true })}
              />
              <span>
                I agree to the{" "}
                <span className="font-semibold accent-underline">Terms of Service</span>
              </span>
            </label>
            {errors.agreetermsofservice && (
              <p className="absolute text-xs text-red-500 -mt-1 left-1">
                You must agree to continue
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 rounded-md font-semibold hover:scale-[1.02] transition accent-bg text-white"
          >
            Sign up
          </button>

          {/* Login Redirect */}
          <div className="text-center text-sm mt-2">
            <span className="opacity-80">Already have an account? </span>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-medium accent-underline hover:opacity-90"
            >
              Log in
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="text-center text-xs opacity-70 font-serif mt-6 accent-text">
        © 2024 Bloggr. All rights reserved.
      </div>
    </div>
  );
};

export default Signup;
