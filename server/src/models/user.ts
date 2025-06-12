import { Schema, model } from "mongoose";

const userSchema = new Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		number: { type: String, required: true },
		countryCode: { type: String, required: true },
		password: { type: String, required: true },
		resetPasswordToken: { type: String },
		resetPasswordExpiryTime: { type: Date },
		passwordResettedAt: { type: Date },
		isDeleted: { type: Boolean, default: false },
		profileImage: { type: String }, // Can be a local disk path or an URL
	},
	{ timestamps: true }
);

const User = model("users", userSchema);

export default User;
