const express = require("express")
const router = express.Router();
const {protectRoute} = require("../middlewares/auth.middleware")

const { 
   createCategory,
   getAllCategory,
   getPostsByCategory
} = require("../controllers/Category")


router.post("/createcategory",protectRoute,createCategory);
router.get("/getallcategory",getAllCategory)
router.get("/getpostsbycategory/:category",getPostsByCategory);



module.exports = router;