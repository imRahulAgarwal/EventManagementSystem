import { ErrorRequestHandler } from "express";
import errorLogger from "../utils/loggers/errorLogger.js";

// GLOBAL ERROR MIDDLEWARE

const errorMiddleware: ErrorRequestHandler = (error, req, res, next) => {
	const message = error.message || "Internal server error";
	const statusCode = error.statusCode || 500;

	errorLogger.log(message, error);
	res.status(statusCode).json({ success: false, error: message });
	return;
};

export default errorMiddleware;
