const express = require("express")
const router  = express.Router();
const {protectRoute} = require("../middlewares/auth.middleware")
const { authLimiter, otpLimiter } = require("../middlewares/rateLimiter")
const {
  signupValidation,
  loginValidation,
  sendOtpValidation,
  sendResetOtpValidation,
  verifyResetOtpValidation,
  resetPasswordValidation,
} = require("../middlewares/validate")

const {login , signup , sendOtp , logout,checkAuth, sendResetOtp, verifyResetOtp, resetPassword} = require("../controllers/Auth");

router.post("/signup", authLimiter, signupValidation, signup);
router.post("/login", authLimiter, loginValidation, login)
router.post("/sendotp", otpLimiter, sendOtpValidation, sendOtp);
router.post("/logout", logout);
router.get("/checkauth", protectRoute, checkAuth);
router.post("/sendresetotp", otpLimiter, sendResetOtpValidation, sendResetOtp);
router.post("/verifyresetotp", otpLimiter, verifyResetOtpValidation, verifyResetOtp);
router.post("/resetpassword", authLimiter, resetPasswordValidation, resetPassword);

module.exports = router;
