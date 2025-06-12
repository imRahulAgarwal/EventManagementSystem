import { Schema, model, Types } from "mongoose";

const logSchema = new Schema(
	{
		level: {
			type: String,
			required: true,
			enum: ["error", "auth", "crud", "warn", "info"],
			index: true, // Index for quick filtering by level
		},

		// Main log message - a concise summary of the event.
		message: {
			type: String,
			required: true,
		},

		// Associated User (for logs related to a specific user action)
		// Indexed for querying logs related to a specific user.
		userId: {
			type: Types.ObjectId,
			ref: "users",
			index: true,
			default: null, // Can be null if not user-specific
		},

		// IP Address (for request-based logs)
		ipAddress: {
			type: String,
			trim: true,
			default: null,
		},

		// Source/Service (where the log originated, e.g., 'api-gateway', 'auth-service', 'cron-job')
		source: {
			type: String,
			trim: true,
			index: true, // Index for filtering by source system
			default: "backend",
		},

		// Action performed (e.g., 'login_success', 'login_failure', 'create', 'update', 'delete', 'refund')
		action: {
			type: String,
			trim: true,
			index: true, // Index for filtering by action type
			default: null,
		},

		// Entity Type (for 'crud' logs, e.g., 'User', 'Order', 'Event', 'TicketType')
		entityType: {
			type: String,
			trim: true,
			index: true, // Index for filtering by entity type
			default: null,
		},

		// Entity ID (for 'crud' logs, the ObjectId of the document affected)
		entityId: {
			type: Types.ObjectId,
			index: true, // Index for finding logs related to a specific document
			default: null,
		},

		// 10. Error Stack Trace (for 'error' logs)
		errorStack: { type: String, default: null },

		// Any additional arbitrary context or details for the log
		// This is a flexible field to store extra JSON data.
		details: {
			type: Schema.Types.Mixed,
			default: {}, // Default to an empty object
		},
	},
	{ timestamps: true }
);

// Optional: Compound indexes for more specific queries
// Example: Find all CRUD logs for a specific user and entity type
logSchema.index({ userId: 1, level: 1, action: 1 });
logSchema.index({ entityType: 1, entityId: 1, level: 1 });

const Log = model("logs", logSchema);

export default Log;
