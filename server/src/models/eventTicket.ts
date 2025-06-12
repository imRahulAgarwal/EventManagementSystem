import { Schema, model, Types } from "mongoose";

const eventTicketSchema = new Schema(
	{
		eventId: { type: Types.ObjectId, ref: "events", required: true },
		eventTicketTypeId: { type: Types.ObjectId, ref: "event_ticket_types", required: true },
		ticketData: { type: String, required: true, unique: true },
		isVerified: { type: Boolean, default: false },
		verifiedAt: { type: Date },
		// If it is false user has purchased the ticket else it is generated in a batch
		isBatchGenerated: { type: Boolean, default: false },
		orderId: { type: Types.ObjectId, ref: "orders" },
		batchId: { type: Types.ObjectId, ref: "event_ticket_batches" },
	},
	{ timestamps: true }
);

const EventTicket = model("event_tickets", eventTicketSchema);

export default EventTicket;
