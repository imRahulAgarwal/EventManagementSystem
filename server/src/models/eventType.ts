import { Schema, model, Types } from "mongoose";

const eventTypeSchema = new Schema(
	{
		name: { type: String, required: true },
		isDeleted: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

const EventType = model("event_types", eventTypeSchema);

export default EventType;
