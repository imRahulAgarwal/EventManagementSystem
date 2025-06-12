import { Schema, model, Types } from "mongoose";

const transactionSchema = new Schema(
	{
		orderId: { type: Types.ObjectId, ref: "orders", required: true },

		// Name of the payment gateway used (e.g., 'Stripe', 'PayPal', 'Razorpay', 'Manual')
		paymentGateway: { type: String, required: true, trim: true },

		// The unique transaction ID provided by the payment gateway
		gatewayTransactionId: { type: String, unique: true, required: true, trim: true },

		// The amount processed in this transaction
		amount: { type: Number, required: true, min: 0 },
		currency: { type: String, required: true, trim: true },

		// Status of the transaction from the gateway's perspective (e.g., 'succeeded', 'failed', 'pending', 'refunded')
		status: {
			type: String,
			enum: ["pending", "succeeded", "failed", "refunded", "authorized", "captured"],
			default: "pending",
			required: true,
		},

		// Type of transaction (e.g., 'charge', 'refund', 'authorization', 'capture')
		type: {
			type: String,
			enum: ["charge", "refund", "authorization", "capture"],
			required: true,
		},

		// The full raw response object received from the payment gateway.
		// This is crucial for payment gateway independence, as it allows storing
		// any specific details without rigid schema definitions for each gateway.
		// Store as Mixed type to allow any object, or JSON.stringify if storing as String
		rawResponse: { type: Schema.Types.Mixed, required: true },
		transactionDate: { type: Date, default: Date.now },
		errorMessage: { type: String, trim: true },
	},
	{ timestamps: true }
);

transactionSchema.index({ gatewayTransactionId: 1 });

const Transaction = model("transactions", transactionSchema);

export default Transaction;
