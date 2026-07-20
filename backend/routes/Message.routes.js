const express = require("express")
const router  = express.Router();
const {protectRoute} = require("../middlewares/auth.middleware")
const { writeLimiter, generalLimiter } = require("../middlewares/rateLimiter")
const { sendMessageValidation, mongoIdParamValidation } = require("../middlewares/validate")

const {
   getUsersForSidebar,
   getMessages,
   sendMessage
} = require("../controllers/Message")

router.get("/getusersforsidebar", protectRoute, generalLimiter, getUsersForSidebar);
router.get("/getmessages/:id", protectRoute, generalLimiter, mongoIdParamValidation("id"), getMessages);
router.post("/sendmessage/:id", protectRoute, writeLimiter, sendMessageValidation, sendMessage);

module.exports = router;
