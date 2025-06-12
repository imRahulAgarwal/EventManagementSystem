import { Schema, model, Types } from "mongoose";

const panelUserTokenSchema = new Schema(
	{
		panelUserId: { type: Types.ObjectId, ref: "panel_users", required: true },
		token: { type: String, required: true, unique: true },
		issuedAt: { type: Date, required: true },
		willExpireAt: { type: Date, required: true },
	},
	{ timestamps: true }
);

panelUserTokenSchema.index({ token: 1 });

const PanelUserToken = model("panel_user_tokens", panelUserTokenSchema);

export default PanelUserToken;
