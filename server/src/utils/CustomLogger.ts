import winston from "winston";
import "winston-daily-rotate-file";

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
