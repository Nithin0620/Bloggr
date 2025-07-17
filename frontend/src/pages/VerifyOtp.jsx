import React, { useState } from "react";
import OtpInput from "react-otp-input";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleChange = (otpValue) => setOtp(otpValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Entered OTP:", otp);
    // TODO: Validate OTP
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white">
      <div className="w-full max-w-md p-8 rounded-xl border border-neutral-800">
        <h2 className="text-2xl font-bold text-center mb-2">Verify Email</h2>
        <p className="text-center text-neutral-400 mb-6">
          A verification code has been sent to your email. Enter the code below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <OtpInput
            value={otp}
            onChange={handleChange}
            numInputs={6}
            renderInput={(props) => (
              <input
                {...props}
                className="w-12 h-12 text-xl text-center rounded-md border border-neutral-700 bg-transparent text-white focus:outline-none accent-border"
              />
            )}
            containerStyle="flex justify-between gap-2"
          />

          <button
            type="submit"
            className="w-full py-3 rounded-md font-semibold accent-bg text-black shadow-accent-box hover:opacity-90 transition"
          >
            Verify Email
          </button>
        </form>

        <div className="flex justify-between items-center mt-4 text-sm">
          <button
            onClick={() => navigate("/signup")}
            className="text-neutral-400 hover:underline"
          >
            ← Back To Signup
          </button>
          <button
            onClick={() => {
              alert("Resend logic goes here");
            }}
            className="accent-text hover:underline"
          >
            ↻ Resend it
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
