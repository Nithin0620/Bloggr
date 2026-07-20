const winston = require("winston");
const path = require("path");
const fs = require("fs");

const isDev = process.env.ENVIRONMENT === "development";

const logsDir = path.join(__dirname, "..", "logs");
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);

const timestampFormat = winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" });
const errorFormat = winston.format.errors({ stack: true });

const consoleFormat = winston.format.combine(
  timestampFormat,
  errorFormat,
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length ? " " + JSON.stringify(meta) : "";
    return stack
      ? `${timestamp} ${level}: ${message}\n${stack}${metaStr}`
      : `${timestamp} ${level}: ${message}${metaStr}`;
  })
);

const jsonFormat = winston.format.combine(
  timestampFormat,
  errorFormat,
  winston.format.json()
);

const logger = winston.createLogger({
  level: isDev ? "debug" : "info",
  transports: [
    new winston.transports.Console({ format: consoleFormat }),
    new winston.transports.File({
      filename: path.join(logsDir, "error.log"),
      level: "error",
      format: jsonFormat,
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(logsDir, "combined.log"),
      format: jsonFormat,
      maxsize: 10 * 1024 * 1024,
      maxFiles: 5,
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: path.join(logsDir, "exceptions.log"), format: jsonFormat }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: path.join(logsDir, "rejections.log"), format: jsonFormat }),
  ],
});

module.exports = logger;
