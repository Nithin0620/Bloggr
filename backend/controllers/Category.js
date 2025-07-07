const Category = require("../modals/category")
const User = require("../modals/user");


export const createCategory = async(req,res)=>{
   try{
      const userId = req.user._id;
      const categoryName = req.body;

      const user= await User.findById(userId);
      if(!user) return res.status(404).json({success:false,message:"user not found"})

      if(!categoryName) return res.status(400).json({success:false,message:"Category Name required"});

      const newCategory = await Category.create(categoryName);

      return res.status(200).json({success:true,message:"New category created successfully",data:newCategory});
   }
   catch(e){
      console.log(e)
      return res.status(500).json({success:false,message:"Error occired in creating new category"});
   }
}

export const getAllCategory = async(req,res)=>{
   try{

      const categories = await Category.find();
      if(!categories) return res.status(404).json({success:false,message:"categories not found"});

      return res.status(200).json({success:true,message:"Categories fetched Successfully",data:categories});
   }
   catch(e){
      console.log(e)
      return res.status(500).json({success:false,message:"Error occired in fetching categories"});
   }
}

export const getPostsByCategory = async (req, res) => {
  try {
      const categoryName = req.params.category;

      const categoryDoc = await Category.findOne({ name: categoryName }).populate({
         path: "posts",
         populate: [
         { path: "author", select: "firstName lastName image" },
         { path: "categories", select: "name" },
         { path: "likes", select: "firstName lastName createdAt" },
         {
            path: "comments",
            populate: { path: "user", select: "firstName lastName image" },
         },
         ],
      });

      if (!categoryDoc) {
         return res.status(404).json({
         success: false,
         message: "Category not found",
         });
      }

      return res.status(200).json({
         success: true,
         message: "Posts for this category fetched successfully",
         data: categoryDoc.posts,
      });
   } 
   catch (e) {
      console.error("Error fetching posts by category:", e);
      return res.status(500).json({
         success: false,
         message: "Server error while fetching posts by category",
      });
   }
};
