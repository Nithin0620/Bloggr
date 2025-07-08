const Notification = require("../modals/notification")
const User = require("../modals/user")
const getReceiverSocketId = require("../configuration/socket")
const Post = require("../modals/post")


exports.createNotification = async (req, res) => {
   try {
      const receiver = req.params.id;
      const sender = req.user._id;
      const { type, post } = req.body;

      if (!sender) {
         return res.status(401).json({ success: false, message: "Unauthorized user" });
      }

      if (!type) {
         return res.status(400).json({ success: false, message: "Notification type is required" });
      }

      if ((type === "like" || type === "comment") && !post) {
         return res.status(400).json({ success: false, message: "Post ID is required for like/comment notifications" });
      }

      var PostResponse;
      if(post){
         PostResponse = await Post.findById(post).populate("author");
      }

      const payload = { sender, receiver, type, ...(post && { PostResponse }) };

      const response = await Notification.create(payload);
      const user = await User.findById(sender);

      if (!user) {
         return res.status(404).json({ success: false, message: "User not found" });
      }

      if (!response) {
         return res.status(400).json({ success: false, message: "Error occurred in creating new notification" });
      }

      const receiverSocketId = getReceiverSocketId(receiver);
      if (receiverSocketId) {
         io.to(receiverSocketId).emit("newNotification", { response, user });
      }

      return res.status(200).json({ success: true, message: "Notification created",data:response });

   } 
   catch (e) {
      console.log(e);
      return res.status(500).json({ success: false, message: "Error occurred in creating new notification" });
   }
};

exports.getAllNotification = async (req, res) => {
   try {
      const userId = req.user._id;

      const user = await User.findById(userId);
      if (!user) {
         return res.status(404).json({
            success: false,
            message: "User not found",
         });
      }

      const notifications = await Notification.find({ receiver: userId }).populate("sender").populate("post").sort({ createdAt: -1 });

      return res.status(200).json({
         success: true,
         message: "Notifications fetched successfully",
         data: notifications,
      });

   } catch (e) {
      console.error("Error fetching notifications:", e);
      return res.status(500).json({
         success: false,
         message: "Error occurred while fetching notifications",
      });
   }
};

exports.markAllAsRead = async(req,res)=>{
   try{
      const userId = req.user._id;

      const user = await User.findById(userId);
      if (!user) {
         return res.status(404).json({
            success: false,
            message: "User not found",
         });
      }

      const notifications = await Notification.find({ receiver: userId }).populate("sender").populate("post").sort({ createdAt: -1 });

      // await Notification.updateMany({ receiver: userId, isRead: false }, { $set: { isRead: true } });

      await Promise.all(
         notifications.map((notification) =>
            Notification.findByIdAndUpdate(notification._id, { isRead: true },{new:true})
         )
      );


      return res.status(200).json({
         success: true,
         message: "Notifications Marked as read successfully",
         data: notifications,
      });

   } catch (e) {
      console.error("Error fetching notifications:", e);
      return res.status(500).json({
         success: false,
         message: "Error occurred while marking notifications ad read",
      });
   }
};

exports.deleteaNotification = async(req,res)=>{
   try{
      const userId = req.user._id;
      const notificationId = req.params.id;

      const user = await User.findById(userId);
      if (!user) {
         return res.status(404).json({
            success: false,
            message: "User not found",
         });
      }

      const notification = await Notification.findById(notificationId);
      if(notification.receiver.toString() !== userId.toString()) return res.status(401).json({success:false,message:"You can't delete this notification"})

      const deletedNotification = await Notification.findByIdAndDelete(notificationId);

      return res.status(200).json({success:true,message:"Notification deleted successfully",data:deletedNotification});
   }
   catch(e){
      console.log(e)
      return res.status(500).json({success:false,message:"Error occured in deleteing this notification"});
   }
}

exports.setNotificationAsRead = async(req,res)=>{
   try{
      const userId = req.user._id;
      const notificationId = req.params.id;

      const user = await User.findById(userId);
      if (!user) {
         return res.status(404).json({
            success: false,
            message: "User not found",
         });
      }

      const notification = await Notification.findById(notificationId);
      if(notification.receiver.toString() !== userId.toString()) return res.status(401).json({success:false,message:"You can't update this notification"})

      const updatedNotification = await Notification.findByIdAndUpdate(notificationId,{isRead:true},{new:true});

      return res.status(200).json({success:true,message:"Notification marked as read successfully",data:updatedNotification});
   }
   catch(e){
      console.log(e)
      return res.status(500).json({success:false,message:"Error occured in marking this notification as read"});
   }
}