import winston from "winston";
import "winston-daily-rotate-file";
import type { MongoDBConnectionOptions } from "winston-mongodb";
import mongoose, { Types } from "mongoose";

const levels = {
	error: 0,
	warn: 1,
	auth: 2,
	crud: 3,
	info: 4,
	http: 5,
	debug: 6,
};

const filename = "%DATE%.log";
const datePattern = "DD-MM-YYYY";

interface LoggerConfig {
	level: keyof typeof levels;
	format: () => winston.Logform.Format;
	isDbLogging: boolean;
	isFileLogging: boolean;
	logDirectoryName?: string;
}

class CustomLogger {
	private readonly config: LoggerConfig;
	private readonly logger: winston.Logger;

	constructor(config: LoggerConfig) {
		this.config = config;
		this.logger = this.initializeLogger();
		this.handleErrors();
	}

	private initializeLogger() {
		const transports: winston.transport[] = [];

		if (this.config.isFileLogging) {
			let dirname = `logs/${this.config.level}`;
			if (this.config.logDirectoryName) {
				dirname = `logs/${this.config.logDirectoryName}/${this.config.level}`;
			}

			const fileLogger = new winston.transports.DailyRotateFile({
				filename,
				datePattern,
				dirname,
				level: this.config.level,
				format: this.config.format(),
				maxSize: "20m",
				zippedArchive: true,
			});

			transports.push(fileLogger);
		}

		if (this.config.isDbLogging) {
			if (mongoose.connection && mongoose.connection.readyState === 1) {
				const dbOptions = {
					db: process.env.MONGO_URL,
					collection: "logs", // The collection name for your Log model
					level: this.config.level,
					format: winston.format((info) => {
						const { level, message, stack, ...meta } = info;

						let userId = meta.userId as string | null;
						if (userId && !Types.ObjectId.isValid(userId)) {
							console.warn(`Invalid userId provided for log: ${userId}. Setting to null.`);
							userId = null;
						}
						let entityId = meta.entityId as string | null;
						if (entityId && !Types.ObjectId.isValid(entityId)) {
							console.warn(`Invalid entityId provided for log: ${entityId}. Setting to null.`);
							entityId = null;
						}

						return {
							level: level,
							message: message,
							userId: userId,
							ipAddress: meta.ipAddress || null,
							requestId: meta.requestId || null,
							source: meta.source || "backend",
							action: meta.action || null,
							entityType: meta.entityType || null,
							entityId: entityId,
							errorStack: stack || meta.errorStack || null,
							details: meta.details || {},
						};
					})(),
				} as MongoDBConnectionOptions;

				const dbTransport = new winston.transports.MongoDB(dbOptions);
				transports.push(dbTransport);
			} else {
				// If not connected, warn and don't add DB transport
				console.warn("Mongoose connection not active. Skipping DB logging transport for now.");
				console.warn(
					"Ensure mongoose.connect() is called and successful before initializing loggers with DB logging."
				);
			}
		}

		if (transports.length === 0) {
			transports.push(new winston.transports.Console());
		}

		return winston.createLogger({
			format: winston.format.errors({ stack: true }),
			levels,
			level: process.env.ENVIRONMENT === "DEVELOPMENT" ? "debug" : process.env.LOG_LEVEL || "http",
			transports,
			handleRejections: process.env.ENVIRONMENT !== "DEVELOPMENT",
		});
	}

	private handleErrors() {
		this.logger.on("error", (error) => {
			console.error("Logger transport error:", error);
		});
	}

	public log(message: string, details?: any) {
		this.logger.log(this.config.level, message, details);
	}
}

export default CustomLogger;
