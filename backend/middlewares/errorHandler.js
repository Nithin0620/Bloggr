const logger = require("../configuration/logger");

function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl}`, {
      statusCode,
      message: err.message,
      stack: err.stack,
      userId: req.user?.user?._id,
    });
  } else {
    logger.warn(`${req.method} ${req.originalUrl}`, {
      statusCode,
      message: err.message,
      userId: req.user?.user?._id,
    });
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.ENVIRONMENT === "development" && { stack: err.stack }),
  });
}

module.exports = errorHandler;
