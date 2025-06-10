import morgan from "morgan";
import httpLogger from "../utils/loggers/httpLogger.js";
import { Request, Response } from "express";

// MORGAN MIDDLEWARE
// Writes http request data to a file

let morganFormat =
	"Method: :method | URL: :url | Status: :status | Total Time: :total-time ms | Content-Length: :res[content-length]";

if (process.env.ENVIRONMENT === "PRODUCTION") {
	morganFormat += " | IP: :remote-addr";
}

const skip = (req: Request, res: Response): boolean => {
	if (!req.url) {
		return false;
	}

	return req.url.startsWith("/uploads");
};

const morganMiddleware = morgan(morganFormat, {
	stream: { write: (message) => httpLogger.log(message.trim()) },
	skip,
});

export default morganMiddleware;
