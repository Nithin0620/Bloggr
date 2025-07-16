const Settings = require("../modals/settings");
const User = require("../modals/user");


exports.setSettings = async(req,res)=>{
   try{
      const userId = req.user._id;
      const user = await User.findById(userId);
      if(!user) return res.status(402).json({success:false,message:"User is not authorised to update the settings"});

      const{mode , theme , pushNotification , emailNotification , homeFeedType} = req.body;

      if(!mode || !theme || !pushNotification || !emailNotification || !homeFeedType) return res.status(400).json({success:false,message:"All the fields are required"});

      const payload = {
         mode , theme , pushNotification , emailNotification , homeFeedType  
      }

      const settingsResponse = await Settings.findOneAndUpdate({user:userId},payload,{new:true});

      return res.status(200).json({success:true,message:"Settings set successfully",data:settingsResponse});
   }
   catch(e){
      console.log(e)
      return res.status(500).json({success:false,message:"Error occured in setSettings Controller"});
   }
}

exports.getSettings = async(req,res)=>{
   try{
      const userId = req.user._id;

      const settingsResponse = await Settings.findOne({user:userId});
      if(!settingsResponse) return res.status(404).json({success:false,message:"Settings details not found"});

      return res.status(200).json({success:true,message:"Settings fetched successfully",data:settingsResponse});
   }
   catch(e){
      console.log(e)
      return res.status(500).json({success:false,message:"Error occured in getSettings Controller"});
   }
}

exports.resetSettings = async(req,res)=>{
   try{
      const userId = req.user._id;
      
      const settingsResponse = await Settings.findOneAndDelete({user:userId});

      const newSettings = await Settings.create({user:userId});

      return res.status(200).json({success:true,message:"Settings Updated Successfully",data:newSettings})
   }
   catch(e){
      console.log(e)
      return res.status(500).json({success:false,message:"Error occured in resetSettings Controller"});
   }
}