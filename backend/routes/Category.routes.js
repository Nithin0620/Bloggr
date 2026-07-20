const express = require("express")
const router = express.Router();
const {protectRoute} = require("../middlewares/auth.middleware")
const { writeLimiter, generalLimiter } = require("../middlewares/rateLimiter")
const { cacheMiddleware } = require("../middlewares/cache")
const {
  createCategoryValidation,
  mongoIdParamValidation,
} = require("../middlewares/validate")

const { 
   createCategory,
   getAllCategory,
   getPostsByCategory
} = require("../controllers/Category")

router.post("/createcategory", protectRoute, writeLimiter, createCategoryValidation, createCategory);
router.get("/getallcategory", generalLimiter, cacheMiddleware("categories", 120), getAllCategory)
router.get("/getpostsbycategory/:category", generalLimiter, getPostsByCategory);

module.exports = router;
