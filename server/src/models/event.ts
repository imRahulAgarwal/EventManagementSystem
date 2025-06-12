import { Schema, model, Types } from "mongoose";

const eventSchema = new Schema(
	{
		name: { type: String, required: true },
		description: { type: String, required: true },
		eventTypeId: { type: Types.ObjectId, ref: "event_types", required: true },
		address: {
			line1: { type: String, required: true },
			line2: { type: String },
			city: { type: String, required: true },
			state: { type: String, required: true },
			country: { type: String, required: true },
			pincode: { type: String, required: true },
			latitude: { type: Number },
			longitude: { type: Number },
		},
		medias: [{ type: String, required: true }], // File Path or URL of image or video media
		isDeleted: { type: Boolean, default: false },
		dateAndTime: { type: Date, required: true },
	},
	{ timestamps: true }
);

const EventModel = model("events", eventSchema);

export default EventModel;
