import { Schema, model, Types } from "mongoose";

const eventTicketBatch = new Schema(
	{
		eventId: { type: Types.ObjectId, ref: "events", required: true },
		ticketTypes: [
			{
				ticketTypeId: { type: Types.ObjectId, required: true },
				ticketCount: { type: Number, required: true },
			},
		],
		// The below three fields will be useful when image generation will take place as it will consume time.
		startedAt: { type: Date },
		isCompleted: { type: Boolean, default: false },
		completedAt: { type: Date },
	},
	{ timestamps: true }
);

const EventTicketBatch = model("event_ticket_batches", eventTicketBatch);

export default EventTicketBatch;
