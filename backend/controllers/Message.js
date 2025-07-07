const Message  = require("../modals/message")
const User = require("../modals/user");

const cloudinary = require("../configuration/cloudinary");

const {getReceiverSocketId , io} = require("../configuration/cloudinary");


export const getUsersForSidebar = async(req,res)=>{
   try{
      const loggedInUserId = req.user._id;
      const filteredUsers = await User.find({_id:{$ne:loggedInUserId}}).select("-password");

      res.status(200).json({success:true,message:"Users fetched successfully" , data:filteredUsers});
   }
   catch(e){
      console.error("Error in getUsersForSidebar: ", error.message);
      res.status(500).json({ error: "Internal server error occured in the getUserforsidebar controller" });
   }
}

export const getMessages = async(req,res)=>{
   try{
      const {id:userToChatId} = req.params;
      const myId = req.user._id;

      const messages = await Message.find({
         $or:[
            {senderId:myId , receiverId:userToChatId},
            {senderId:userToChatId , receiverId:myId},
         ],
      })

      if(!messages){
         return res.status(400).json({success:false,message:"Un able to fetched messages"});
      }
      return res.status(200).json({success:true,message:"Messages fetched Successfully",data:messages});
   }
   catch(e){
      console.log(e);
      return res.status(500).json({success:false,message:"Error occured in the Get messages controller"});
   }
}

export const sendMessage = async(req,res)=>{
   try{
      const {text,image} = req.body;
      const {id:receiverId}=req.params;
      const senderId = req.user._id;

      let imageUrl;
      if(image){
         const uploadResponse = await cloudinary.uploader.upload(image);
         imageUrl = uploadResponse.secure_url;
      }

      const payload = {
         senderId,
         receiverId,
         text,
         image:imageUrl
      }

      const newMessage = await Message.create(payload);

      const receiverSocketId = getReceiverSocketId(receiverId);

      if(receiverSocketId){
         io.to(receiverSocketId).emit("newMessage",newMessage);
      }

      return res.status(200).json({success:true,message:"Message sent successfully"});
   }
   catch(e){
      console.log(e);
      return res.status(500).json({success:false,message:"Error occured in the send messages controller"});
   }
}