import nodemailer from "nodemailer";
import { Transporter } from "nodemailer";
import infoLogger from "./loggers/infoLogger.js";

/**
 * @interface EmailOptions
 * @description Defines the structure for email sending options.
 */
export interface EmailOptions {
	to: string | string[]; // Single recipient or an array of recipients
	subject: string;
	text?: string; // Plain text body
	html?: string; // HTML body
	cc?: string | string[]; // Carbon Copy recipients
	bcc?: string | string[]; // Blind Carbon Copy recipients
	attachments?: {
		filename: string;
		content?: string | Buffer; // Content as string or buffer
		path?: string; // Path to a file
		contentType?: string;
	}[];
	// Add any other Nodemailer mail options here if needed, e.g., replyTo, inReplyTo, etc.
}

let transporter: Transporter;
let defaultFromEmail: string;

/**
 * @function createTransporter
 * @description Creates and initializes the Nodemailer transporter.
 * This function will use environment variables for SMTP settings.
 * If environment variables are not found, it generates Ethereal test account credentials.
 */
async function createTransporter() {
	const host = process.env.EMAIL_HOST;
	const port = process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : undefined;
	const secure = process.env.EMAIL_SECURE === "true";
	const user = process.env.EMAIL_USER;
	const pass = process.env.EMAIL_PASS;
	const fromEmail = process.env.EMAIL_FROM;

	if (host && port && user && pass !== undefined) {
		// Use provided environment variables
		transporter = nodemailer.createTransport({
			host: host,
			port: port,
			secure: secure,
			auth: {
				user: user,
				pass: pass,
			},
		});
		defaultFromEmail = fromEmail || `"Event Management System" <${user}>`;
		infoLogger.log("[Email Service] Using provided SMTP credentials from .env");
	} else {
		// Create a new Ethereal test account if no credentials are provided
		const testAccount = await nodemailer.createTestAccount();
		transporter = nodemailer.createTransport({
			host: "smtp.ethereal.email",
			port: 587,
			secure: false,
			auth: {
				user: testAccount.user,
				pass: testAccount.pass,
			},
		});
		defaultFromEmail = `"Event Management System" <${testAccount.user}>`;
		infoLogger.log("[Email Service] SMTP credentials not fully provided in .env. Using Ethereal test account.");
		infoLogger.log(`[Email Service] Ethereal Account User: ${testAccount.user}`);
		infoLogger.log(`[Email Service] Ethereal Account Pass: ${testAccount.pass}`);
	}

	// Verify transporter connection
	try {
		await transporter.verify();
		infoLogger.log("[EmailService] Nodemailer transporter is ready to take messages.");
	} catch (error: any) {
		throw error;
	}
}

// Initialize the transporter when the module is loaded
createTransporter()
	.then(() => infoLogger.log("[EmailService] Transporter ready."))
	.catch((error: Error) => {
		infoLogger.log("[EmailService] Failed to initialize transporter:", error.message);
		process.exit(1);
	});

/**
 * @function sendEmail
 * @description Sends an email using Nodemailer. This function throws an error on failure
 * and returns the complete info object on success.
 * @param {EmailOptions} options - Options for the email to be sent.
 * @returns {Promise<any>} A promise that resolves with the complete mail info object on success.
 * @throws {Error} If the email sending fails or transporter is not initialized.
 */
export async function sendEmail(options: EmailOptions): Promise<any> {
	if (!transporter) {
		throw new Error("Email transporter is not initialized. Ensure createTransporter has run.");
	}

	const mailOptions = {
		from: defaultFromEmail,
		to: Array.isArray(options.to) ? options.to.join(",") : options.to,
		subject: options.subject,
		text: options.text,
		html: options.html,
		cc: Array.isArray(options.cc) ? options.cc.join(",") : options.cc,
		bcc: Array.isArray(options.bcc) ? options.bcc.join(",") : options.bcc,
		attachments: options.attachments,
	};

	const info = await transporter.sendMail(mailOptions);
	return info;
}
