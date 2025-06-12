import { Schema, model, Types } from "mongoose";

const orderTicketItemSchema = new Schema(
	{
		eventId: { type: Types.ObjectId, ref: "events", required: true },
		ticketTypeId: { type: Types.ObjectId, ref: "event_ticket_types", required: true },
		eventName: { type: String, required: true, trim: true },
		eventDate: { type: Date, required: true },
		eventLocation: { type: String, required: true, trim: true },
		ticketTypeName: { type: String, required: true, trim: true },
		ticketTypeDescription: { type: String, trim: true },
		count: { type: Number, required: true, min: 1 },
		pricePerTicket: { type: Number, required: true, min: 0 },
		subtotal: { type: Number, required: true, min: 0 },
	},
	{ _id: false }
);

const orderSchema = new Schema(
	{
		userId: { type: Types.ObjectId, ref: "users", required: true },

		// A unique, human-readable identifier for the order
		orderNumber: { type: String, unique: true, required: true, trim: true },

		customerName: { type: String, required: true, trim: true },
		customerEmail: { type: String, required: true, trim: true },
		items: [orderTicketItemSchema],
		totalTickets: { type: Number, default: 0, min: 0 },
		totalAmount: { type: Number, required: true, min: 0 },
		currency: { type: String, required: true, default: "INR", trim: true }, // e.g., 'USD', 'INR'

		// Current status of the order (e.g., 'pending', 'completed', 'cancelled', 'refunded')
		status: {
			type: String,
			enum: ["pending", "completed", "cancelled", "refunded", "failed"],
			default: "pending",
			required: true,
		},

		// Status of the payment for this order
		paymentStatus: {
			type: String,
			enum: ["unpaid", "paid", "refunded", "failed"],
			default: "unpaid",
			required: true,
		},

		transactionId: {
			type: Types.ObjectId,
			ref: "transactions",
			// required: true, // This can be required *after* a successful payment attempt
			// but might be null for pending orders or if payment fails immediately
		},
		notes: { type: String, trim: true },
	},
	{ timestamps: true }
);

const Order = model("orders", orderSchema);

export default Order;
