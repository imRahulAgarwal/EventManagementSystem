import winston from "winston";
import CustomLogger from "../CustomLogger.js";

// GLOBAL HTTP LOGGER

const httpLogger = new CustomLogger({
	isDbLogging: false,
	isFileLogging: true,
	level: "http",
	format: () =>
		winston.format.combine(
			winston.format.timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS A" }),
			winston.format.align(),
			winston.format.printf(({ timestamp, message }) => `[${timestamp}] -> ${message}`)
		),
});

export default httpLogger;
