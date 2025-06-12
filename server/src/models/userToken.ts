import { Schema, model, Types } from "mongoose";

const userTokenSchema = new Schema(
	{
		userId: { type: Types.ObjectId, ref: "users", required: true },
		token: { type: String, required: true, unique: true },
		issuedAt: { type: Date, required: true },
		willExpireAt: { type: Date, required: true },
	},
	{ timestamps: true }
);

userTokenSchema.index({ token: 1 });

const UserToken = model("user_tokens", userTokenSchema);

export default UserToken;
