import winston from "winston";
import CustomLogger from "../CustomLogger.js";

// GLOBAL ERROR LOGGER

const crudLogger = new CustomLogger({
	level: "crud",
	format: () =>
		winston.format.combine(
			winston.format.timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS A" }),
			winston.format.align(),
			winston.format.printf((info) => {
				const { timestamp, message, userId, operation, ...details } = info;
				let logMessage = `[${timestamp}]-> ${message} | User ID: ${userId} | Operation : ${operation}`;

				if (Object.keys(details).length) {
					logMessage += ` | Details : ${JSON.stringify(details, null, 2)}`;
				}

				return logMessage;
			})
		),
	isDbLogging: false,
	isFileLogging: true,
});

export default crudLogger;
