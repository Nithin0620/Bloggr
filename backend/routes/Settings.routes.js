const express = require("express")
const router = express.Router();

const {setSettings,getSettings,resetSettings} = require("../controllers/Settings")
const {protectRoute} = require("../middlewares/auth.middleware")
const { writeLimiter } = require("../middlewares/rateLimiter")
const { setSettingsValidation } = require("../middlewares/validate")

router.post("/setsettings", protectRoute, writeLimiter, setSettingsValidation, setSettings);
router.get("/getsettings", protectRoute, getSettings);
router.get("/resetsettings", protectRoute, writeLimiter, resetSettings);

module.exports = router;
