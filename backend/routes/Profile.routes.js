const express = require("express")
const router = express.Router();
const {protectRoute} = require("../middlewares/auth.middleware")
const upload = require("../middlewares/multer")
const { writeLimiter, generalLimiter } = require("../middlewares/rateLimiter")
const {
  updateProfileValidation,
  mongoIdParamValidation,
} = require("../middlewares/validate")

const {
   viewUserProfile,
   updateProfileInfo,
   uploadProfilePic,
   deleteProfilePic,
   followUser,
   unfollowUser,
   getFollowersList,
   getFollowingList,
} = require("../controllers/UserProfile")

router.get("/viewuserprofile/:id", generalLimiter, mongoIdParamValidation("id"), viewUserProfile);
router.put("/updateprofileinfo", protectRoute, writeLimiter, updateProfileValidation, updateProfileInfo)
router.post("/uploadprofilepic", protectRoute, writeLimiter, upload.single("image"), uploadProfilePic);
router.delete("/deleteprofilepic", protectRoute, writeLimiter, deleteProfilePic);
router.put("/followuser/:id", protectRoute, writeLimiter, mongoIdParamValidation("id"), followUser);
router.put("/unfollowuser/:id", protectRoute, writeLimiter, mongoIdParamValidation("id"), unfollowUser);
router.get("/getfollowerslist/:id", generalLimiter, mongoIdParamValidation("id"), getFollowersList);
router.get("/getfollowinglist/:id", generalLimiter, mongoIdParamValidation("id"), getFollowingList);

module.exports = router;
