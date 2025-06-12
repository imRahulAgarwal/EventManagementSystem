import { Schema, model } from "mongoose";

const initSchema = new Schema(
	{
		permissionHash: String,
		permissionHashUpdatedAt: Date,
		keyName: String,
		lastInitialized_at: Date,
		initialized: Boolean,
	},
	{ timestamps: true }
);

const Init = model("inits", initSchema);

export default Init;
