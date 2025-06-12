import { Schema, model, Types } from "mongoose";

const cartTicketItemSchema = new Schema(
	{
		eventId: { type: Types.ObjectId, ref: "events", required: true },
		ticketType: { type: Types.ObjectId, ref: "event_ticket_types", required: true },
		count: { type: Number, required: true, min: 1 },
	},
	{ _id: false }
);

const cartSchema = new Schema(
	{
		userId: { type: Types.ObjectId, ref: "users", required: true, unique: true },
		items: [cartTicketItemSchema],
	},
	{ timestamps: true }
);

const Cart = model("carts", cartSchema);

export default Cart;
