import winston from "winston";
import CustomLogger from "../CustomLogger.js";

// GLOBAL ERROR LOGGER

const errorLogger = new CustomLogger({
	level: "error",
	format: () =>
		winston.format.combine(
			winston.format.timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS A" }),
			winston.format.align(),
			winston.format.printf(({ timestamp, message, stack }) => {
				return stack ? `[${timestamp}]-> ${message}\n${stack}` : `[${timestamp}]-> ${message}`;
			})
		),
	isDbLogging: false,
	isFileLogging: true,
});

export default errorLogger;
