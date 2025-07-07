const express = require("express")
const router  = express.Router();
const {protectRoutes} = require("../middlewares/auth.middleware")


const {login , signup , sendOtp , logout} = require("../controllers/Auth");


router.post("/signup",signup);

router.post("/login",login)

router.post("/sendotp",sendOtp);

router.post("/logout", logout);


module.exports = router;