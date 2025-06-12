import { Schema, model, Types } from "mongoose";

const panelUserSchema = new Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true },
		password: { type: String, required: true },
		roleIds: [{ type: Types.ObjectId, required: true }],
		isDeleted: { type: Boolean, default: false },
		resetPasswordToken: { type: String },
		resetPasswordExpiryTime: { type: Date }, // Till when the (token is active) or (user can reset password) time
		passwordChangedAt: { type: Date },
	},
	{ timestamps: true }
);

const PanelUser = model("panel_users", panelUserSchema);

export default PanelUser;
