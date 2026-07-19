import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";
import { Loader, Mail, ArrowLeft, KeyRound } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState("email"); // email | otp | reset
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { setnavigate } = useAuthStore();
  const BASE_URL =
    process.env.REACT_APP_MODE === "development"
      ? "http://localhost:4000/api"
      : "/api";

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const axios = (await import("axios")).default;
      const res = await axios.post(
        `${BASE_URL}/auth/sendresetotp`,
        { email },
        { withCredentials: true }
      );
      if (res.data.success) {
        setResetEmail(email);
        setStep("otp");
      }
    } catch (err) {
      const toast = (await import("react-hot-toast")).default;
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // Auto focus next
    if (value && index < 5) {
      const next = document.querySelector(`input[name="otp-${index + 1}"]`);
      if (next) next.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prev = document.querySelector(`input[name="otp-${index - 1}"]`);
      if (prev) prev.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length !== 6) return;
    setLoading(true);
    try {
      const axios = (await import("axios")).default;
      const res = await axios.post(
        `${BASE_URL}/auth/verifyresetotp`,
        { email: resetEmail, otp: otpString },
        { withCredentials: true }
      );
      if (res.data.success) {
        setStep("reset");
      }
    } catch (err) {
      const toast = (await import("react-hot-toast")).default;
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) return;
    if (newPassword !== confirmPassword) {
      const toast = (await import("react-hot-toast")).default;
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      const toast = (await import("react-hot-toast")).default;
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const axios = (await import("axios")).default;
      const toast = (await import("react-hot-toast")).default;
      const res = await axios.post(
        `${BASE_URL}/auth/resetpassword`,
        { email: resetEmail, newPassword, confirmPassword },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("Password reset successful! Please login.");
        navigate("/login");
      }
    } catch (err) {
      const toast = (await import("react-hot-toast")).default;
      toast.error(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start transition-colors duration-300 accent-bg-mode accent-text-mode pt-[4.75rem]">
      <div className="w-[95%] max-w-md">
        <div className="rounded-xl shadow-md px-10 py-8 flex flex-col gap-4 accent-border border transition-colors duration-300 accent-bg-mode accent-text-mode">
          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mb-2">
            {["email", "otp", "reset"].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    step === s
                      ? "accent-bg text-white scale-110"
                      : ["otp", "reset"].indexOf(step) > ["otp", "reset"].indexOf(s)
                      ? "accent-bg text-white opacity-60"
                      : "border accent-border text-gray-400"
                  }`}
                >
                  {["otp", "reset"].indexOf(step) > ["otp", "reset"].indexOf(s) ? "✓" : i + 1}
                </div>
                {i < 2 && (
                  <div
                    className={`w-8 h-[2px] rounded-full transition-all duration-300 ${
                      ["otp", "reset"].indexOf(step) > ["otp", "reset"].indexOf(s)
                        ? "accent-bg"
                        : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* ===== STEP 1: Email ===== */}
          {step === "email" && (
            <>
              <div className="text-center">
                <div className="mx-auto w-14 h-14 rounded-full accent-bg/10 flex items-center justify-center mb-3">
                  <Mail className="w-7 h-7 accent-text" />
                </div>
                <h1 className="text-2xl font-bold accent-text">
                  Forgot Password?
                </h1>
                <p className="text-sm opacity-80 font-serif accent-text mt-1">
                  No worries! Enter your email and we'll send you a reset code.
                </p>
              </div>

              <form onSubmit={handleSendOtp} className="flex flex-col gap-4 mt-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border accent-border rounded-md outline-none focus:ring-2 focus:ring-[var(--accent)] text-sm transition-colors duration-300 accent-bg-mode accent-text-mode"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full py-2.5 rounded-md font-semibold hover:scale-[1.02] transition accent-bg text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader className="animate-spin mx-auto" />
                  ) : (
                    "Send Reset Code"
                  )}
                </button>
              </form>

              <button
                onClick={() => navigate("/login")}
                className="flex items-center justify-center gap-1 text-sm font-medium accent-underline hover:opacity-90 mx-auto mt-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </button>
            </>
          )}

          {/* ===== STEP 2: OTP ===== */}
          {step === "otp" && (
            <>
              <div className="text-center">
                <div className="mx-auto w-14 h-14 rounded-full accent-bg/10 flex items-center justify-center mb-3">
                  <KeyRound className="w-7 h-7 accent-text" />
                </div>
                <h1 className="text-2xl font-bold accent-text">
                  Enter Reset Code
                </h1>
                <p className="text-sm opacity-80 font-serif accent-text mt-1">
                  We sent a 6-digit code to
                </p>
                <p className="text-sm font-semibold accent-text">{resetEmail}</p>
              </div>

              <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4 mt-2">
                <div className="flex justify-center gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      name={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-10 h-12 text-center text-xl font-bold rounded-lg border accent-border bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition duration-200"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.join("").length !== 6}
                  className="w-full py-2.5 rounded-md font-semibold hover:scale-[1.02] transition accent-bg text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader className="animate-spin mx-auto" />
                  ) : (
                    "Verify Code"
                  )}
                </button>
              </form>

              <div className="flex justify-between items-center mt-1 text-sm">
                <button
                  onClick={() => setStep("email")}
                  className="hover:underline transition flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Change email
                </button>
                <button
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="hover:underline transition"
                >
                  Resend code
                </button>
              </div>
            </>
          )}

          {/* ===== STEP 3: New Password ===== */}
          {step === "reset" && (
            <>
              <div className="text-center">
                <div className="mx-auto w-14 h-14 rounded-full accent-bg/10 flex items-center justify-center mb-3">
                  <KeyRound className="w-7 h-7 accent-text" />
                </div>
                <h1 className="text-2xl font-bold accent-text">
                  Set New Password
                </h1>
                <p className="text-sm opacity-80 font-serif accent-text mt-1">
                  Create a strong password for your account
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="flex flex-col gap-4 mt-2">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 border accent-border rounded-md outline-none focus:ring-2 focus:ring-[var(--accent)] text-sm transition-colors duration-300 accent-bg-mode accent-text-mode pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 border accent-border rounded-md outline-none focus:ring-2 focus:ring-[var(--accent)] text-sm transition-colors duration-300 accent-bg-mode accent-text-mode pr-10"
                  />
                </div>

                {newPassword && confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-xs text-red-500 -mt-2">Passwords do not match</p>
                )}

                <button
                  type="submit"
                  disabled={loading || !newPassword || !confirmPassword}
                  className="w-full py-2.5 rounded-md font-semibold hover:scale-[1.02] transition accent-bg text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader className="animate-spin mx-auto" />
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      <div className="text-center text-xs opacity-70 font-serif accent-text mt-6">
        © 2024 Bloggr. All rights reserved.
      </div>
    </div>
  );
};

export default ForgotPassword;
