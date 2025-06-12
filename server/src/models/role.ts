import { Schema, Types, model } from "mongoose";

const roleSchema = new Schema(
	{
		name: { type: String, required: true },
		permissionIds: [{ type: Types.ObjectId, required: true, ref: "permissions" }],
		description: { type: String },
		isAdmin: { type: Boolean, default: false },
		isDefaultRole: { type: Boolean, default: false },
		isDeleted: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

const Role = model("roles", roleSchema);

export default Role;
