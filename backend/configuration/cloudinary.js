const cloudinary = require('cloudinary').v2
require("dotenv").config();
const logger = require("./logger");


cloudinaryConnect = () => {
	try {
		cloudinary.config({
			cloud_name: process.env.CLOUD_NAME,
			api_key: process.env.API_KEY,
			api_secret: process.env.API_SECRET,
		});
		logger.info("Cloudinary configured")
	} catch (error) {
		logger.error(error);
	}
};

module.exports = {
  cloudinaryInstance: cloudinary,
  cloudinaryConnect,
};
