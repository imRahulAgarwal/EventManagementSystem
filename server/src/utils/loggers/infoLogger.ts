import winston from "winston";
import CustomLogger from "../CustomLogger.js";

// GLOBAL INFO LOGGER

const infoLogger = new CustomLogger({
	level: "info",
	format: () =>
		winston.format.combine(
			winston.format.timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS A" }),
			winston.format.align(),
			winston.format.printf((info) => {
				const { timestamp, message, ...details } = info;
				let logMessage = `[${timestamp}]-> ${message}`;

				if (Object.keys(details).length) {
					logMessage += ` | Details : ${JSON.stringify(details, null, 2)}`;
				}

				return logMessage;
			})
		),
	isDbLogging: false,
	isFileLogging: true,
});

export default infoLogger;
