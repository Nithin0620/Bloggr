import React, { useState } from "react";
import OtpInput from "react-otp-input";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";
import { ImSpinner3 } from "react-icons/im";

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleChange = (otpValue) => setOtp(otpValue);
  const{signup,beforeSignUpData,isSigningup,sendotp} = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {...beforeSignUpData , otp:otp};
    // console.log("Data:",data);
    signup(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br to-neutral-950 px-4 transition-colors duration-300 accent-bg-mode accent-text-mode">
      <div className="w-full max-w-md p-8 rounded-2xl border accent-border shadow-accent-box backdrop-blur-lg">
        <h2 className="text-3xl font-bold text-center mb-3 tracking-wide">
          Verify Email
        </h2>
        <p className="text-center mb-6 text-sm">
          A verification code has been sent to your email. Enter the code below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 transition-colors duration-300 accent-bg-mode accent-text-mode">
          <OtpInput
            value={otp}
            onChange={handleChange}
            numInputs={6}
            
            renderInput={(props) => (
              <input
                {...props}
                placeholder="꘎"
                className="!w-10 h-12 md:!w-10 md:h-14 text-2xl text-center rounded-lg border accent-border bg-transparent focus:outline-none focus:ring-2  transition duration-200"
              />
            )}
            containerStyle="flex justify-center gap-3"
          />

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-semibold accent-bg  shadow-accent-box hover:scale-[1.01] hover:opacity-90 transition duration-200"
          >
            {
              isSigningup ? (<div className='flex justify-center items-center accent-text-mode animate-spin'>
                <ImSpinner3/>
              </div>) : (<div>
                Verify Email
              </div>)
            }
            
          </button>
        </form>

        <div className="flex justify-between items-center mt-6 text-sm transition-colors duration-300 accent-bg-mode accent-text-mode">
          <button
            onClick={() => navigate("/signup")}
            className="hover:underline transition"
          >
            ← Back To Signup
          </button>
          <button
            onClick={() => sendotp()}
            className="hover:underline transition"
          >
            ↻ Resend it
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
