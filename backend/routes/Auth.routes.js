const express = require("express")
const router  = express.Router();
const {protectRoute} = require("../middlewares/auth.middleware")


const {login , signup , sendOtp , logout,checkAuth} = require("../controllers/Auth");


router.post("/signup",signup);

router.post("/login",login)

router.post("/sendotp",sendOtp);

router.post("/logout", logout);

router.get("/checkauth", protectRoute,checkAuth);



module.exports = router;