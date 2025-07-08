const express = require("express")
const router  = express.Router();
const {protectRoute} = require("../middlewares/auth.middleware")

const {
   getUsersForSidebar,
   getMessages,
   sendMessage
} = require("../controllers/Message")

router.get("/getusersforsidebar", protectRoute, getUsersForSidebar);

router.get("/getmessages/:id", protectRoute, getMessages);

router.post("/sendmessage/:id", protectRoute, sendMessage);

module.exports = router;