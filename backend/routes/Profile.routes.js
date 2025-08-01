const express = require("express")
const router = express.Router();
const {protectRoute} = require("../middlewares/auth.middleware")
const upload = require("../middlewares/multer")

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


router.get("/viewuserprofile/:id",viewUserProfile);
router.put("/updateprofileinfo",protectRoute,updateProfileInfo)
router.post("/uploadprofilepic",protectRoute,upload.single("image"),uploadProfilePic);
router.delete("/deleteprofilepic",protectRoute,deleteProfilePic);
router.put("/followuser/:id",protectRoute,followUser);
router.put("/unfollowuser/:id",protectRoute,unfollowUser);
router.get("/getfollowerslist/:id",getFollowersList);
router.get("/getfollowinglist/:id",getFollowingList);


module.exports = router;