const express = require("express")
const router = express.Router();

const {setSettings,getSettings,resetSettings} = require("../controllers/Settings")
const {protectRoute} = require("../middlewares/auth.middleware")


router.post("/setsettings",protectRoute,setSettings);
router.get("/getsettings",protectRoute,getSettings);
router.get("/resetsettings",protectRoute,resetSettings);


module.exports = router;