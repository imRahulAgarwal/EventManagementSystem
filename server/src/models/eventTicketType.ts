import { Schema, model, Types } from "mongoose";

const eventTicketTypeSchema = new Schema(
	{
		eventId: { type: Types.ObjectId, ref: "events", required: true },
		name: { type: String, required: true }, // Name of the ticket type Eg: Silver, Gold, Platinum, Fan Pit etc.
		imagePath: { type: String, required: true }, // This is the ticket type design path that can either be URL or local disk path
		isDeleted: { type: Boolean, default: false },
		description: { type: String },
		qrDimensions: {
			width: { type: Number, required: true },
			height: { type: Number, required: true },
		},
		qrPositions: {
			top: { type: Number, required: true },
			left: { type: Number, required: true },
		},
	},
	{ timestamps: true }
);

const EventTicketType = model("event_ticket_types", eventTicketTypeSchema);

export default EventTicketType;
