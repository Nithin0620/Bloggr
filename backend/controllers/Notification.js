import notification from "../modals/notification";

const Notification = require("../modals/notification")
const User = require("../modals/user")

export const getAllNotification = async (req, res) => {
   try {
      const userId = req.user.id;

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

export const markAllAsRead = async(req,res)=>{
   try{
      const userId = req.user.id;

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

      await notifications.save();

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

export const deleteaNotification = async(req,res)=>{
   try{
      const userId = req.user.id;
      const {notificationId} = req.body;

      const user = await User.findById(userId);
      if (!user) {
         return res.status(404).json({
            success: false,
            message: "User not found",
         });
      }

      const notification = await Notification.findById(notificationId);
      if(notification.receiver !== userId) return res.status(401).json({success:false,message:"You can't delete this notification"})

      const deletedNotification = await Notification.findByIdAndDelete(notificationId);

      return res.status(200).json({success:true,message:"Notification deleted successfully"});
   }
   catch(e){
      console.log(e)
      return res.status(500).json({success:false,message:"Error occured in deleteing this notification"});
   }
}

export const setNotificationAsRead = async(req,res)=>{
   try{
      const userId = req.user.id;
      const {notificationId} = req.body;

      const user = await User.findById(userId);
      if (!user) {
         return res.status(404).json({
            success: false,
            message: "User not found",
         });
      }

      const notification = await Notification.findById(notificationId);
      if(notification.receiver !== userId) return res.status(401).json({success:false,message:"You can't update this notification"})

      const updatedNotification = await Notification.findByIdAndUpdate(notificationId,{isRead:true},{new:true});

      return res.status(200).json({success:true,message:"Notification marked as read successfully"});
   }
   catch(e){
      console.log(e)
      return res.status(500).json({success:false,message:"Error occured in marking this notification as read"});
   }
}