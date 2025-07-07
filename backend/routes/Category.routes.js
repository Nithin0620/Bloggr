const express = require("express")
const router = express.Router();
const {protectRoutes} = require("../middlewares/auth.middleware")

const { 
   createCategory,
   getAllCategory,
   getPostsByCategory
} = require("../controllers/Category")


router.post("/createcategory/",protectRoute,createCategory);
router.get("/getallcategory",getAllCategory)
router.post("/getpostsbycategory/:category",getPostsByCategory);



module.exports = router;