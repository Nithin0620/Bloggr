const cloudinary = require('cloudinary').v2
require("dotenv").config();


cloudinaryConnect = () => {
	try {
		cloudinary.config({
			cloud_name: process.env.CLOUD_NAME,
			api_key: process.env.API_KEY,
			api_secret: process.env.API_SECRET,
		});
		console.log("Cloudinary configured successfully")
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
  cloudinaryInstance: cloudinary,
  cloudinaryConnect,
};
