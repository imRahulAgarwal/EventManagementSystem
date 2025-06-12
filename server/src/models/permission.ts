import { Schema, model } from "mongoose";

const permissionSchema = new Schema(
	{
		moduleName: { type: String, required: true },
		displayName: { type: String, required: true },
		uniqueName: { type: String, required: true, unique: true },
	},
	{ timestamps: true }
);

const Permission = model("permissions", permissionSchema);

export default Permission;
