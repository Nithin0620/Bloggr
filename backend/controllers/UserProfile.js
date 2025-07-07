const cloudinary = require("../configuration/cloudinary")
const bcrypt = require("bcrypt")
const User = require("../modals/user")
const Profile = require("../modals/profile")


export const viewUserProfile = async(req,res)=>{
   try{
      const Id = req.params.id;

      if(!Id) return res.status(401).json({success:false,message:"id not found on the link"});

      const response = await User.findById(Id)
      .populate({
         path:"profile",
         populate:{
            path:"posts" ,
            populate:[
               { path: "author", select: "firstName lastName image" },
               { path: "categories", select: "name" },
               { path: "likes", select: "firstName lastName" },
               {
                  path: "comments",
                  populate: { path: "user", select: "firstName lastName image" },
               },
            ],     
         }
      });


      if(!response) return res.status(404).json({success:false,message:"User details not found"});

      return res.status(200).json({
         success:true,
         message:"User details fetched successfully",
         data:response
      })
   }
   catch(e){
      console.log(e)
      return res.status(500).json({success:false,message:"Error occured in fetching the user Details"});
   }  
}

export const updateProfileInfo = async (req, res) => {
  try {
      const userId = req.user._id;

      const user = await User.findById(userId).populate("profile");
      
      if (!user) {
         return res.status(404).json({ success: false, message: "User not found" });
      }

      const { firstName, lastName, password, confirmPassword, image, bio } = req.body;

      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;

      if(image) {
         const uploadResponse = await cloudinary.uploader.upload(image);
         user.profilePic = uploadResponse.secure_url
      }

      if (password || confirmPassword) {
         if (password !== confirmPassword) {
         return res.status(400).json({ success: false, message: "Passwords do not match" });
         }
         const hashedPassword = await bcrypt.hash(password, 10); 
         user.password = hashedPassword;
      }

      if (user.profile) {
         const profile = user.profile;
         if (firstName || lastName) profile.name = firstName +" "+lastName;
         if (bio) profile.bio = bio;
         await profile.save();
      }

      await user.save();

      return res.status(200).json({
         success: true,
         message: "Profile updated successfully",
         data: {
            firstName: user.firstName,
            lastName: user.lastName,
            image: user.profilePic,
            bio: user.profile?.bio,
         }
      });
   } 
   catch (error) {
      console.error("Error in updateProfileInfo:", error.message);
      return res.status(500).json({ success: false, message: "Server Error" });
   }
};

export const uploadProfilePic = async(req,res)=>{
   try{
      const userId = req.user._id;

      const user = await User.findById(userId);
      
      if (!user) {
         return res.status(404).json({ success: false, message: "User not found" });
      }

      const image = req.body;
      if(!image) return res.status(400).json({success:false,message:"image not found"});

      const uploadResponse  = await cloudinary.uploader.upload(image);
      if(uploadResponse) user.profilePic = uploadResponse.secure_url;

      await user.save();

      return res.status(200).json({
         success: true,
         message: "Profile Picture updated successfully",
         data: user.profilePic
      });

   } 
   catch (error) {
      console.error("Error in updateProfilePic:", error.message);
      return res.status(500).json({ success: false, message: "Server Error" });
   }
};

export const deleteProfilePic = async(req,res)=>{
   try{
      const userId = req.user._id;

      const user = await User.findById(userId);
      
      if (!user) {
         return res.status(404).json({ success: false, message: "User not found" });
      }

      user.profilePic = `https://api.dicebear.com/5.x/initials/svg?seed=${user.firstName} ${user.lastName}`;
      user.save();

      return res.status(200).json({
         success: true,
         message: "Profile Picture Deleted successfully",
         data: user.profilePic
      });

   } 
   catch (error) {
      console.error("Error in delete profilepic:", error.message);
      return res.status(500).json({ success: false, message: "Server Error" });
   }
};

export const followUser = async (req, res) => {
  try {
      const currentUserId = req.user._id;
      const targetUserId = req.params.id;

      if (currentUserId === targetUserId) {
         return res.status(400).json({
         success: false,
         message: "You cannot follow yourself",
         });
      }

      const targetUser = await User.findById(targetUserId).populate("profile");
      const currentUser = await User.findById(currentUserId).populate("profile");

      if (!targetUser || !currentUser) {
         return res.status(404).json({
         success: false,
         message: "User not found",
         });
      }

      const targetProfile = targetUser.profile;
      const currentProfile = currentUser.profile;

      if (targetProfile.followers.includes(currentUserId)) {
         return res.status(400).json({
         success: false,
         message: "You already follow this user",
         });
      }

      targetProfile.followers.push(currentUserId);
      currentProfile.following.push(targetUserId);

      await targetProfile.save();
      await currentProfile.save();

      return res.status(200).json({
         success: true,
         message: "User followed successfully",
      });
   } 
   catch (e) {
      console.log(e);
      return res.status(500).json({
         success: false,
         message: "An error occurred while following the user",
      });
   }
};

export const unfollowUser = async(req,res)=>{
   try{
      const currentUserId = req.user._id;
      const targetUserId = req.params.id;

      if (currentUserId === targetUserId) {
         return res.status(400).json({
         success: false,
         message: "You cannot Unfollow yourself",
         });
      }

      const targetUser = await User.findById(targetUserId).populate("profile");
      const currentUser = await User.findById(currentUserId).populate("profile");

      if (!targetUser || !currentUser) {
         return res.status(404).json({
         success: false,
         message: "User not found",
         });
      }
       if (!targetProfile.followers.includes(currentUserId)) {
         return res.status(400).json({
         success: false,
         message: "You have already Un followed this user",
         });
      }

      targetProfile.followers.pull(currentUserId);
      currentProfile.following.pull(targetUserId);

      await targetProfile.save();
      await currentProfile.save();

      return res.status(200).json({
         success: true,
         message: "User Un followed successfully",
      });
   } 
   catch (e) {
      console.log(e);
      return res.status(500).json({
         success: false,
         message: "An error occurred while Un following the user",
      });
   }
};

export const getFollowersList = async(req,res)=>{
   try{
      const userId = req.params.id;

      const user = await User.findById(userId).populate({path:"profile" , populate:"followers"} );
      if(!user){
         return res.status(404).json({
            success:false,
            message:"user not found",
         })
      }

      const followersList = user?.profile?.followers || [];

      return res.status(200).json({
         success:true,
         message:"Followers list extracted successfully",
         data:followersList,
      })
   }
   catch(e){
      console.log(e)
      return res.status(500).json({
         success:false,
         message:"error occured in getFollowersList",
      })
   }
}

export const getFollowingList = async(req,res)=>{
   try{
      const userId = req.params.id;

      const user = await User.findById(userId).populate({path:"profile" , populate:"following"} );
      if(!user){
         return res.status(404).json({
            success:false,
            message:"user not found",
         })
      }

      const followingsList = user?.profile?.following || [];

      return res.status(200).json({
         success:true,
         message:"followings list extracted successfully",
         data:followingsList,
      })
   }
   catch(e){
      console.log(e)
      return res.status(500).json({
         success:false,
         message:"error occured in getFollowingList",
      })
   }
}